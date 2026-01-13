import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface VerificationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  userId: number;
  onSuccess?: () => void;
}

const VerificationDialog = ({ isOpen, onOpenChange, userId, onSuccess }: VerificationDialogProps) => {
  const [step, setStep] = useState<'intro' | 'form' | 'success'>('intro');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    phone: '',
    email: '',
    documentType: 'passport',
    documentNumber: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('https://functions.poehali.dev/3230ddfa-8fb7-462a-a355-6b873d5d8824', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          phone: formData.phone,
          email: formData.email,
          document_type: formData.documentType,
          document_number: formData.documentNumber
        })
      });

      if (response.ok) {
        setStep('success');
        onSuccess?.();
      } else {
        const error = await response.json();
        alert(`Ошибка: ${error.error || 'Не удалось отправить заявку'}`);
      }
    } catch (error) {
      alert('Ошибка соединения с сервером');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setStep('intro');
    setFormData({ phone: '', email: '', documentType: 'passport', documentNumber: '' });
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {step === 'intro' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent flex items-center gap-3">
                <Icon name="ShieldCheck" size={36} className="text-primary" />
                Стать проверенным продавцом
              </DialogTitle>
              <DialogDescription>
                Повысьте доверие покупателей и продавайте быстрее
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-2xl border-2 border-green-200">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon name="TrendingUp" className="text-white" size={24} />
                  </div>
                  <h3 className="font-bold mb-2">+40% продаж</h3>
                  <p className="text-sm text-gray-600">Покупатели чаще выбирают проверенных продавцов</p>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-6 rounded-2xl border-2 border-blue-200">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mb-4">
                    <Icon name="Shield" className="text-white" size={24} />
                  </div>
                  <h3 className="font-bold mb-2">Защита сделок</h3>
                  <p className="text-sm text-gray-600">Приоритетная поддержка и помощь в спорах</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-2xl border-2 border-purple-200">
                  <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-xl flex items-center justify-center mb-4">
                    <Icon name="BadgeCheck" className="text-white" size={24} />
                  </div>
                  <h3 className="font-bold mb-2">Бейдж "Проверен"</h3>
                  <p className="text-sm text-gray-600">Выделяйтесь среди других продавцов</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-bold text-lg">Что нужно для верификации?</h3>
                <ul className="space-y-3">
                  <li className="flex items-start gap-3">
                    <Icon name="CheckCircle2" className="text-green-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Контактные данные</p>
                      <p className="text-sm text-gray-600">Номер телефона и email для связи</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="CheckCircle2" className="text-green-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">Документ, удостоверяющий личность</p>
                      <p className="text-sm text-gray-600">Паспорт или водительское удостоверение</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <Icon name="CheckCircle2" className="text-green-500 mt-1" size={20} />
                    <div>
                      <p className="font-semibold">5 минут времени</p>
                      <p className="text-sm text-gray-600">Проверка занимает 1-2 рабочих дня</p>
                    </div>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
                <div className="flex items-start gap-3">
                  <Icon name="Lock" className="text-blue-600 mt-1" size={20} />
                  <div>
                    <p className="font-semibold text-blue-900">Ваши данные защищены</p>
                    <p className="text-sm text-blue-700">Мы используем шифрование и не передаем информацию третьим лицам</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-2"
                  onClick={handleClose}
                >
                  Позже
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
                  onClick={() => setStep('form')}
                >
                  Начать верификацию
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
              </div>
            </div>
          </>
        )}

        {step === 'form' && (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Заявка на верификацию</DialogTitle>
              <DialogDescription>
                Заполните форму для проверки аккаунта
              </DialogDescription>
            </DialogHeader>

            <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  Номер телефона
                </label>
                <Input 
                  type="tel"
                  placeholder="+7 (999) 123-45-67" 
                  className="border-2"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Для связи с вами в случае необходимости</p>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  Email
                </label>
                <Input 
                  type="email"
                  placeholder="example@mail.ru" 
                  className="border-2"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  required
                />
              </div>

              <Separator />

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon name="FileText" size={16} />
                  Тип документа
                </label>
                <select 
                  className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                  value={formData.documentType}
                  onChange={(e) => setFormData({...formData, documentType: e.target.value})}
                >
                  <option value="passport">Паспорт РФ</option>
                  <option value="driver_license">Водительское удостоверение</option>
                  <option value="international_passport">Загранпаспорт</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                  <Icon name="Hash" size={16} />
                  Серия и номер документа
                </label>
                <Input 
                  placeholder="1234 567890" 
                  className="border-2"
                  value={formData.documentNumber}
                  onChange={(e) => setFormData({...formData, documentNumber: e.target.value})}
                  required
                />
                <p className="text-xs text-gray-500 mt-1">Данные используются только для верификации</p>
              </div>

              <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
                <div className="flex items-start gap-3">
                  <Icon name="AlertCircle" className="text-amber-600 mt-1" size={20} />
                  <p className="text-sm text-amber-900">
                    Указывайте достоверные данные. При несоответствии информации верификация будет отклонена.
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  type="button"
                  variant="outline" 
                  className="flex-1 border-2"
                  onClick={() => setStep('intro')}
                  disabled={loading}
                >
                  <Icon name="ArrowLeft" className="mr-2" size={18} />
                  Назад
                </Button>
                <Button 
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
                  disabled={loading}
                >
                  {loading ? 'Отправка...' : 'Отправить заявку'}
                  <Icon name="Send" className="ml-2" size={18} />
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <>
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Icon name="CheckCircle" className="text-white" size={48} />
              </div>
              
              <h2 className="text-3xl font-bold mb-4">Заявка отправлена!</h2>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Мы получили вашу заявку на верификацию. Проверка занимает обычно 1-2 рабочих дня. 
                Мы уведомим вас по email о результатах.
              </p>

              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 mb-6">
                <h3 className="font-bold mb-4">Что дальше?</h3>
                <div className="space-y-3 text-left">
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">1</Badge>
                    <p className="text-sm">Наши специалисты проверят предоставленные данные</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">2</Badge>
                    <p className="text-sm">Вы получите уведомление о статусе верификации</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <Badge className="mt-1">3</Badge>
                    <p className="text-sm">После одобрения бейдж "Проверен" появится в вашем профиле</p>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full bg-gradient-to-r from-primary to-secondary"
                onClick={handleClose}
              >
                Отлично, понятно!
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default VerificationDialog;
