import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const NOTIFICATIONS_API = 'https://functions.poehali.dev/55d98f15-8033-4d27-ac50-67ade721280a';

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

interface NotificationBellProps {
  userId: number;
}

const NotificationBell = ({ userId }: NotificationBellProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${NOTIFICATIONS_API}?user_id=${userId}`);
      const data = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      await fetch(NOTIFICATIONS_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'verification_approved':
        return <Icon name="CheckCircle" className="text-green-600" size={24} />;
      case 'verification_rejected':
        return <Icon name="XCircle" className="text-red-600" size={24} />;
      default:
        return <Icon name="Bell" className="text-primary" size={24} />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Только что';
    if (diffMins < 60) return `${diffMins} мин назад`;
    if (diffHours < 24) return `${diffHours} ч назад`;
    if (diffDays < 7) return `${diffDays} дн назад`;
    
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'short'
    });
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Icon name="Bell" size={22} />
          {unreadCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-red-500 text-white text-xs"
            >
              {unreadCount > 9 ? '9+' : unreadCount}
            </Badge>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Icon name="Bell" size={24} className="text-primary" />
            Уведомления
            {unreadCount > 0 && (
              <Badge variant="secondary">{unreadCount} непрочитанных</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Загрузка уведомлений...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-bold mb-2 text-gray-700">Уведомлений нет</h3>
              <p className="text-gray-600 text-sm">Здесь будут появляться важные оповещения</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <Card
                  key={notification.id}
                  className={`border-2 transition-all ${
                    !notification.is_read 
                      ? 'bg-purple-50/50 border-primary/30' 
                      : 'border-gray-200'
                  }`}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <CardTitle className="text-base leading-tight">
                            {notification.title}
                          </CardTitle>
                          {!notification.is_read && (
                            <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-1" />
                          )}
                        </div>
                        <CardDescription className="text-sm mb-3">
                          {notification.message}
                        </CardDescription>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {formatDate(notification.created_at)}
                          </span>
                          {!notification.is_read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 text-xs"
                              onClick={() => markAsRead(notification.id)}
                            >
                              <Icon name="Check" size={14} className="mr-1" />
                              Прочитано
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </>
          )}
        </div>

        {notifications.length > 0 && (
          <>
            <Separator className="my-4" />
            <Button
              variant="ghost"
              className="w-full text-sm text-primary hover:text-primary/80"
              onClick={fetchNotifications}
            >
              <Icon name="RefreshCw" size={16} className="mr-2" />
              Обновить уведомления
            </Button>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NotificationBell;
