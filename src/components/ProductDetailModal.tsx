import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  description?: string;
  location?: string;
  image: string;
  views?: number;
  verified: boolean;
  posted?: string;
  seller: string;
  rating: number;
}

interface ProductDetailModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const ProductDetailModal = ({ isOpen, onOpenChange, product }: ProductDetailModalProps) => {
  if (!product) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            {product.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <div>
            <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl flex items-center justify-center text-[12rem] mb-4 hover:scale-105 transition-transform">
              {product.image}
            </div>
            
            <div className="flex gap-2 mb-4">
              <Badge className="bg-gradient-to-r from-primary to-secondary text-base py-1 px-3">
                {product.category}
              </Badge>
              {product.verified && (
                <Badge variant="outline" className="border-green-500 text-green-600 text-base py-1 px-3">
                  <Icon name="BadgeCheck" size={16} className="mr-1" />
                  Проверен
                </Badge>
              )}
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 space-y-3">
              <div className="flex items-center gap-3">
                <Icon name="MapPin" size={20} className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Местоположение</p>
                  <p className="font-semibold">{product.location || 'Не указано'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <Icon name="Clock" size={20} className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Размещено</p>
                  <p className="font-semibold">{product.posted || 'Недавно'}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center gap-3">
                <Icon name="Eye" size={20} className="text-gray-600" />
                <div>
                  <p className="text-sm text-gray-500">Просмотры</p>
                  <p className="font-semibold">{product.views || 0}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {product.price.toLocaleString()} ₽
                </span>
              </div>
              
              <div className="flex gap-3 mb-6">
                <Button className="flex-1 bg-gradient-to-r from-primary to-secondary text-lg py-6 hover:opacity-90">
                  <Icon name="MessageCircle" className="mr-2" size={20} />
                  Написать продавцу
                </Button>
                <Button variant="outline" size="icon" className="border-2 border-primary hover:bg-primary/10 w-14 h-14">
                  <Icon name="Heart" size={24} className="text-primary" />
                </Button>
              </div>

              <div className="bg-white border-2 rounded-2xl p-6 mb-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {product.seller[0]}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold">{product.seller}</h3>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Icon 
                            key={i} 
                            name="Star" 
                            size={16} 
                            className={i < Math.floor(product.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"} 
                          />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
                
                {product.verified && (
                  <div className="flex items-start gap-3 p-3 bg-green-50 rounded-xl border border-green-200">
                    <Icon name="ShieldCheck" size={20} className="text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold text-green-900">Проверенный продавец</p>
                      <p className="text-xs text-green-700">Прошел верификацию платформы</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1">
              <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                <Icon name="FileText" size={24} className="text-primary" />
                Описание
              </h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {product.description || 'Описание не предоставлено продавцом.'}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 border-2"
                  onClick={() => onOpenChange(false)}
                >
                  Закрыть
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-secondary to-accent hover:opacity-90">
                  <Icon name="Phone" className="mr-2" size={18} />
                  Позвонить
                </Button>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductDetailModal;
