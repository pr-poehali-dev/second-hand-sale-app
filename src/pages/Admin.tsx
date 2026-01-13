import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const VERIFICATION_API = 'https://functions.poehali.dev/3230ddfa-8fb7-462a-a355-6b873d5d8824';
const NOTIFICATIONS_API = 'https://functions.poehali.dev/55d98f15-8033-4d27-ac50-67ade721280a';

interface VerificationRequest {
  id: number;
  user_id: number;
  status: string;
  phone: string;
  email: string;
  submitted_at: string;
  user_name: string;
  user_rating: number;
}

const Admin = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await fetch(VERIFICATION_API);
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    setActionLoading(true);
    try {
      const response = await fetch(VERIFICATION_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action: 'approve'
        })
      });

      if (response.ok) {
        if (selectedRequest) {
          await fetch(NOTIFICATIONS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: selectedRequest.user_id,
              type: 'verification_approved',
              title: 'Верификация одобрена',
              message: 'Поздравляем! Ваша заявка на верификацию одобрена. Теперь у вас есть бейдж "Проверенный продавец" и ваши объявления получат приоритет в поиске!'
            })
          });
        }
        await fetchRequests();
        setIsReviewModalOpen(false);
        setSelectedRequest(null);
      } else {
        alert('Ошибка при одобрении заявки');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (requestId: number) => {
    if (!rejectionReason.trim()) {
      alert('Укажите причину отклонения');
      return;
    }

    setActionLoading(true);
    try {
      const response = await fetch(VERIFICATION_API, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          request_id: requestId,
          action: 'reject',
          rejection_reason: rejectionReason
        })
      });

      if (response.ok) {
        if (selectedRequest) {
          await fetch(NOTIFICATIONS_API, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              user_id: selectedRequest.user_id,
              type: 'verification_rejected',
              title: 'Заявка отклонена',
              message: `К сожалению, ваша заявка на верификацию отклонена. Причина: ${rejectionReason}. Вы можете подать заявку повторно после исправления указанных недостатков.`
            })
          });
        }
        await fetchRequests();
        setIsReviewModalOpen(false);
        setSelectedRequest(null);
        setRejectionReason('');
      } else {
        alert('Ошибка при отклонении заявки');
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    } finally {
      setActionLoading(false);
    }
  };

  const openReviewModal = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setIsReviewModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-500">На рассмотрении</Badge>;
      case 'approved':
        return <Badge className="bg-green-500">Одобрено</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Отклонено</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center">
                <Icon name="ShieldCheck" className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  Админ-панель
                </h1>
                <p className="text-sm text-gray-600">Модерация заявок на верификацию</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              onClick={fetchRequests}
              className="border-2"
            >
              <Icon name="RefreshCw" className="mr-2" size={18} />
              Обновить
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                  <Icon name="Clock" className="text-yellow-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-yellow-600">
                  {requests.filter(r => r.status === 'pending').length}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">Ожидают проверки</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-green-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-green-600">
                  {requests.filter(r => r.status === 'approved').length}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">Одобрено</CardTitle>
            </CardHeader>
          </Card>

          <Card className="border-2 hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                  <Icon name="XCircle" className="text-red-600" size={24} />
                </div>
                <span className="text-3xl font-bold text-red-600">
                  {requests.filter(r => r.status === 'rejected').length}
                </span>
              </div>
              <CardTitle className="text-lg mt-4">Отклонено</CardTitle>
            </CardHeader>
          </Card>
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="text-2xl">Заявки на верификацию</CardTitle>
            <CardDescription>
              Проверяйте документы и одобряйте или отклоняйте заявки
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-12">
                <p className="text-xl text-gray-600">Загрузка заявок...</p>
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📋</div>
                <h3 className="text-2xl font-bold mb-2 text-gray-700">Заявок пока нет</h3>
                <p className="text-gray-600">Новые заявки появятся здесь автоматически</p>
              </div>
            ) : (
              <div className="space-y-4">
                {requests.map((request) => (
                  <Card 
                    key={request.id}
                    className={`border-2 hover:shadow-md transition-all ${
                      request.status === 'pending' ? 'border-yellow-200 bg-yellow-50/30' : ''
                    }`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-xl font-bold">
                              {request.user_name[0]}
                            </div>
                            <div>
                              <h3 className="text-xl font-bold">{request.user_name}</h3>
                              <div className="flex items-center gap-2">
                                <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                                <span className="text-sm font-semibold">{request.user_rating.toFixed(1)}</span>
                                <span className="text-sm text-gray-500">• ID: {request.user_id}</span>
                              </div>
                            </div>
                          </div>

                          <Separator className="my-3" />

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center gap-3">
                              <Icon name="Phone" size={18} className="text-gray-600" />
                              <div>
                                <p className="text-xs text-gray-500">Телефон</p>
                                <p className="font-semibold">{request.phone}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Icon name="Mail" size={18} className="text-gray-600" />
                              <div>
                                <p className="text-xs text-gray-500">Email</p>
                                <p className="font-semibold">{request.email}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Icon name="Calendar" size={18} className="text-gray-600" />
                              <div>
                                <p className="text-xs text-gray-500">Дата подачи</p>
                                <p className="font-semibold text-sm">{formatDate(request.submitted_at)}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <Icon name="FileText" size={18} className="text-gray-600" />
                              <div>
                                <p className="text-xs text-gray-500">Статус</p>
                                {getStatusBadge(request.status)}
                              </div>
                            </div>
                          </div>
                        </div>

                        {request.status === 'pending' && (
                          <div className="flex flex-col gap-2">
                            <Button
                              size="sm"
                              className="bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                              onClick={() => openReviewModal(request)}
                            >
                              <Icon name="Eye" className="mr-2" size={16} />
                              Рассмотреть
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <Dialog open={isReviewModalOpen} onOpenChange={setIsReviewModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Рассмотрение заявки</DialogTitle>
            <DialogDescription>
              Проверьте данные пользователя и примите решение
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 mt-6">
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border-2 border-purple-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {selectedRequest.user_name[0]}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{selectedRequest.user_name}</h3>
                    <div className="flex items-center gap-2">
                      <Icon name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      <span className="font-semibold">{selectedRequest.user_rating.toFixed(1)}</span>
                      <span className="text-gray-500">• User ID: {selectedRequest.user_id}</span>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Телефон</p>
                    <p className="font-semibold text-lg">{selectedRequest.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-lg">{selectedRequest.email}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-600 mb-1">Дата подачи заявки</p>
                    <p className="font-semibold">{formatDate(selectedRequest.submitted_at)}</p>
                  </div>
                </div>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border-2 border-amber-200">
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" className="text-amber-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-amber-900 mb-1">Важно</p>
                    <p className="text-sm text-amber-800">
                      Убедитесь, что данные соответствуют документам. После одобрения пользователь получит бейдж "Проверен".
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Причина отклонения (опционально)
                </label>
                <Textarea
                  placeholder="Укажите причину, если отклоняете заявку..."
                  className="border-2 min-h-24"
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>

              <Separator />

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-2"
                  onClick={() => {
                    setIsReviewModalOpen(false);
                    setRejectionReason('');
                  }}
                  disabled={actionLoading}
                >
                  Отмена
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1"
                  onClick={() => handleReject(selectedRequest.id)}
                  disabled={actionLoading}
                >
                  <Icon name="XCircle" className="mr-2" size={18} />
                  Отклонить
                </Button>
                <Button
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:opacity-90"
                  onClick={() => handleApprove(selectedRequest.id)}
                  disabled={actionLoading}
                >
                  <Icon name="CheckCircle" className="mr-2" size={18} />
                  Одобрить
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;