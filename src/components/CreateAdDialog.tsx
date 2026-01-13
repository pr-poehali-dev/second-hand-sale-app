import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Category {
  name: string;
  icon: string;
  count: number;
}

interface NewAd {
  title: string;
  category: string;
  price: string;
  location: string;
  description: string;
}

interface CreateAdDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  newAd: NewAd;
  setNewAd: (ad: NewAd) => void;
  categories: Category[];
  onSubmit: (ad: any) => Promise<boolean>;
}

const CreateAdDialog = ({ isOpen, onOpenChange, newAd, setNewAd, categories, onSubmit }: CreateAdDialogProps) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await onSubmit({
      title: newAd.title,
      price: parseInt(newAd.price),
      category: newAd.category,
      description: newAd.description,
      location: newAd.location
    });
    
    if (success) {
      onOpenChange(false);
      setNewAd({ title: '', category: 'Электроника', price: '', location: '', description: '' });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Разместить объявление
          </DialogTitle>
          <DialogDescription>
            Заполните форму, чтобы опубликовать ваше объявление
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-6 mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Icon name="Type" size={16} />
              Название товара
            </label>
            <Input 
              placeholder="Например: iPhone 13 Pro 256GB" 
              className="border-2"
              value={newAd.title}
              onChange={(e) => setNewAd({...newAd, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Icon name="Grid" size={16} />
                Категория
              </label>
              <select 
                className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                value={newAd.category}
                onChange={(e) => setNewAd({...newAd, category: e.target.value})}
              >
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
                <Icon name="DollarSign" size={16} />
                Цена (₽)
              </label>
              <Input 
                type="number" 
                placeholder="0" 
                className="border-2"
                value={newAd.price}
                onChange={(e) => setNewAd({...newAd, price: e.target.value})}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Icon name="MapPin" size={16} />
              Местоположение
            </label>
            <Input 
              placeholder="Город, район" 
              className="border-2"
              value={newAd.location}
              onChange={(e) => setNewAd({...newAd, location: e.target.value})}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold mb-2 flex items-center gap-2">
              <Icon name="FileText" size={16} />
              Описание
            </label>
            <Textarea 
              placeholder="Подробно опишите состояние товара, комплектацию и другие важные детали..."
              className="border-2 min-h-32"
              value={newAd.description}
              onChange={(e) => setNewAd({...newAd, description: e.target.value})}
              required
            />
          </div>

          <div className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl">
            <div className="flex items-start gap-3 mb-4">
              <Icon name="Camera" size={24} className="text-primary mt-1" />
              <div>
                <h4 className="font-bold mb-1">Добавьте фотографии</h4>
                <p className="text-sm text-gray-600">Объявления с фото получают в 5 раз больше откликов</p>
              </div>
            </div>
            <Button type="button" variant="outline" className="w-full border-2 border-primary hover:bg-primary/10">
              <Icon name="Upload" className="mr-2" size={18} />
              Загрузить фото
            </Button>
          </div>

          <Separator />

          <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-xl border-2 border-blue-200">
            <Icon name="ShieldCheck" size={24} className="text-blue-600 mt-1" />
            <div>
              <h4 className="font-bold text-blue-900 mb-1">Станьте проверенным продавцом</h4>
              <p className="text-sm text-blue-700">Пройдите верификацию, чтобы увеличить доверие покупателей и продавать быстрее</p>
            </div>
          </div>

          <div className="flex gap-3">
            <Button 
              type="button" 
              variant="outline" 
              className="flex-1 border-2"
              onClick={() => onOpenChange(false)}
            >
              Отмена
            </Button>
            <Button 
              type="submit"
              className="flex-1 bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90"
            >
              <Icon name="CheckCircle" className="mr-2" size={18} />
              Опубликовать
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateAdDialog;
