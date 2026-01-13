import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [selectedProduct, setSelectedProduct] = useState<typeof products[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isCreateAdOpen, setIsCreateAdOpen] = useState(false);
  const [newAd, setNewAd] = useState({
    title: '',
    category: 'Электроника',
    price: '',
    location: '',
    description: ''
  });

  const categories = [
    { name: 'Электроника', icon: 'Laptop', count: 1250 },
    { name: 'Одежда', icon: 'Shirt', count: 3400 },
    { name: 'Мебель', icon: 'Sofa', count: 890 },
    { name: 'Спорт', icon: 'Dumbbell', count: 560 },
    { name: 'Детские товары', icon: 'Baby', count: 720 },
    { name: 'Авто', icon: 'Car', count: 430 }
  ];

  const products = [
    {
      id: 1,
      title: 'iPhone 13 Pro 256GB',
      price: 65000,
      seller: 'Анна К.',
      rating: 4.9,
      verified: true,
      image: '📱',
      category: 'Электроника'
    },
    {
      id: 2,
      title: 'Диван угловой, почти новый',
      price: 28000,
      seller: 'Михаил П.',
      rating: 4.7,
      verified: true,
      image: '🛋️',
      category: 'Мебель'
    },
    {
      id: 3,
      title: 'Велосипед горный 29"',
      price: 18500,
      seller: 'Сергей Д.',
      rating: 4.8,
      verified: true,
      image: '🚴',
      category: 'Спорт'
    },
    {
      id: 4,
      title: 'Куртка зимняя North Face',
      price: 7200,
      seller: 'Елена Р.',
      rating: 5.0,
      verified: true,
      image: '🧥',
      category: 'Одежда'
    }
  ];

  const reviews = [
    {
      id: 1,
      name: 'Дмитрий В.',
      rating: 5,
      text: 'Отличная платформа! Продал старый ноутбук за 2 дня. Проверка продавцов внушает доверие.',
      date: '2 дня назад'
    },
    {
      id: 2,
      name: 'Мария С.',
      rating: 5,
      text: 'Купила детскую коляску в отличном состоянии. Продавец оказался надежным, все прошло гладко!',
      date: '5 дней назад'
    },
    {
      id: 3,
      name: 'Алексей К.',
      rating: 4,
      text: 'Хорошая площадка для покупки б/у товаров. Система рейтингов помогает выбрать проверенного продавца.',
      date: '1 неделю назад'
    }
  ];

  const scrollToSection = (section: string) => {
    setActiveSection(section);
    const element = document.getElementById(section);
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-purple-100 shadow-sm">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="text-4xl">🛍️</div>
              <span className="text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                БУшка
              </span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('home')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Главная
              </button>
              <button 
                onClick={() => scrollToSection('catalog')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Каталог
              </button>
              <button 
                onClick={() => scrollToSection('howto')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Как продать
              </button>
              <button 
                onClick={() => scrollToSection('reviews')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Отзывы
              </button>
              <button 
                onClick={() => scrollToSection('contacts')}
                className="text-gray-700 hover:text-primary transition-colors font-medium"
              >
                Контакты
              </button>
            </div>

            <div className="flex items-center gap-3">
              <Button 
                className="hidden md:block bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                onClick={() => setIsCreateAdOpen(true)}
              >
                Разместить объявление
              </Button>
              
              <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Icon name="Menu" size={24} />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[300px] bg-white">
                  <SheetHeader>
                    <SheetTitle className="flex items-center gap-2">
                      <div className="text-3xl">🛍️</div>
                      <span className="text-xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                        БУшка
                      </span>
                    </SheetTitle>
                  </SheetHeader>
                  <div className="flex flex-col gap-4 mt-8">
                    <button 
                      onClick={() => {
                        scrollToSection('home');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors p-3 hover:bg-purple-50 rounded-lg"
                    >
                      <Icon name="Home" size={20} />
                      Главная
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('catalog');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors p-3 hover:bg-purple-50 rounded-lg"
                    >
                      <Icon name="Grid" size={20} />
                      Каталог
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('howto');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors p-3 hover:bg-purple-50 rounded-lg"
                    >
                      <Icon name="TrendingUp" size={20} />
                      Как продать
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('reviews');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors p-3 hover:bg-purple-50 rounded-lg"
                    >
                      <Icon name="Star" size={20} />
                      Отзывы
                    </button>
                    <button 
                      onClick={() => {
                        scrollToSection('contacts');
                        setIsMobileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 text-lg font-medium text-gray-700 hover:text-primary transition-colors p-3 hover:bg-purple-50 rounded-lg"
                    >
                      <Icon name="Mail" size={20} />
                      Контакты
                    </button>
                    <Separator className="my-2" />
                    <Button 
                      className="w-full bg-gradient-to-r from-primary via-secondary to-accent hover:opacity-90 transition-opacity"
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        setIsCreateAdOpen(true);
                      }}
                    >
                      <Icon name="Plus" className="mr-2" size={18} />
                      Разместить объявление
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </nav>
      </header>

      <section id="home" className="py-20 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-16 animate-fade-in">
            <h1 className="text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Покупай и продавай с доверием
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Платформа для безопасной покупки и продажи б/у товаров с системой проверки продавцов
            </p>
            <div className="flex gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary text-lg px-8 hover:opacity-90 transition-opacity"
                onClick={() => scrollToSection('catalog')}
              >
                <Icon name="Search" className="mr-2" size={20} />
                Найти товар
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 border-2 border-primary hover:bg-primary/10"
                onClick={() => scrollToSection('howto')}
              >
                <Icon name="TrendingUp" className="mr-2" size={20} />
                Продать
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-primary animate-slide-up">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="ShieldCheck" className="text-white" size={24} />
                </div>
                <CardTitle>Проверенные продавцы</CardTitle>
                <CardDescription>
                  Система рейтингов и верификации для вашей безопасности
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary animate-slide-up" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Zap" className="text-white" size={24} />
                </div>
                <CardTitle>Быстрые сделки</CardTitle>
                <CardDescription>
                  Удобный поиск и прямая связь с продавцом
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 border-2 hover:border-accent animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-br from-accent to-primary rounded-2xl flex items-center justify-center mb-4">
                  <Icon name="Sparkles" className="text-white" size={24} />
                </div>
                <CardTitle>Лучшие цены</CardTitle>
                <CardDescription>
                  Экономьте до 70% на б/у товарах в отличном состоянии
                </CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="bg-white rounded-3xl p-8 shadow-lg">
            <h2 className="text-3xl font-bold mb-6 text-center">Популярные категории</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {categories.map((category, index) => (
                <button
                  key={index}
                  className="p-6 rounded-2xl bg-gradient-to-br from-purple-50 to-pink-50 hover:from-primary hover:to-secondary hover:text-white transition-all duration-300 group hover:scale-105"
                >
                  <Icon name={category.icon as any} className="mx-auto mb-3 group-hover:scale-110 transition-transform" size={32} />
                  <h3 className="font-semibold mb-1">{category.name}</h3>
                  <p className="text-sm opacity-70">{category.count} объявлений</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="catalog" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Актуальные объявления
            </h2>
            <p className="text-gray-600 text-lg">Свежие предложения от проверенных продавцов</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <Card 
                key={product.id} 
                className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary animate-scale-in group"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="aspect-square bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center text-8xl group-hover:scale-110 transition-transform">
                  {product.image}
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <Badge className="bg-gradient-to-r from-primary to-secondary">{product.category}</Badge>
                    {product.verified && (
                      <Badge variant="outline" className="border-green-500 text-green-600">
                        <Icon name="BadgeCheck" size={14} className="mr-1" />
                        Проверен
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-lg">{product.title}</CardTitle>
                  <CardDescription>
                    <div className="flex items-center gap-2 mt-2">
                      <Icon name="User" size={16} />
                      <span>{product.seller}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Icon name="Star" size={14} className="text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">{product.rating}</span>
                      </div>
                    </div>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                      {product.price.toLocaleString()} ₽
                    </span>
                    <Button size="sm" className="bg-gradient-to-r from-primary to-secondary">
                      Купить
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="border-2 border-primary hover:bg-primary/10">
              Показать все объявления
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </section>

      <section id="howto" className="py-20 px-6">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
              Как продать товар
            </h2>
            <p className="text-gray-600 text-lg">Простой процесс в 4 шага</p>
          </div>

          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Зарегистрируйтесь',
                description: 'Создайте аккаунт и пройдите простую верификацию для получения бейджа "Проверенный продавец"',
                icon: 'UserPlus'
              },
              {
                step: 2,
                title: 'Создайте объявление',
                description: 'Добавьте фото, описание и цену товара. Это займет всего 3 минуты!',
                icon: 'Camera'
              },
              {
                step: 3,
                title: 'Общайтесь с покупателями',
                description: 'Отвечайте на вопросы и договаривайтесь о встрече в удобном месте',
                icon: 'MessageCircle'
              },
              {
                step: 4,
                title: 'Получите деньги',
                description: 'Передайте товар покупателю и получите оплату. После сделки попросите оставить отзыв!',
                icon: 'Coins'
              }
            ].map((item, index) => (
              <Card 
                key={item.step} 
                className="overflow-hidden hover:shadow-xl transition-all duration-300 border-2 hover:border-secondary animate-fade-in"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <CardContent className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-secondary to-accent rounded-2xl flex items-center justify-center text-white text-2xl font-bold">
                      {item.step}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-3 mb-3">
                        <Icon name={item.icon as any} className="text-secondary" size={28} />
                        <h3 className="text-2xl font-bold">{item.title}</h3>
                      </div>
                      <p className="text-gray-600 text-lg">{item.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="bg-gradient-to-r from-secondary to-accent text-lg px-8">
              <Icon name="Plus" className="mr-2" size={20} />
              Создать объявление
            </Button>
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-6 bg-white/50">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent">
              Отзывы пользователей
            </h2>
            <p className="text-gray-600 text-lg">Что говорят о нас покупатели и продавцы</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((review, index) => (
              <Card 
                key={review.id} 
                className="hover:shadow-xl transition-all duration-300 border-2 hover:border-accent animate-scale-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                        {review.name[0]}
                      </div>
                      <div>
                        <CardTitle className="text-base">{review.name}</CardTitle>
                        <p className="text-sm text-gray-500">{review.date}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-3">
                    {[...Array(review.rating)].map((_, i) => (
                      <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                    ))}
                  </div>
                  <CardDescription className="text-base leading-relaxed">
                    {review.text}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="contacts" className="py-20 px-6">
        <div className="container mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Свяжитесь с нами
            </h2>
            <p className="text-gray-600 text-lg">Есть вопросы? Мы всегда на связи!</p>
          </div>

          <Card className="border-2 hover:border-primary transition-colors">
            <CardContent className="p-8">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Ваше имя</label>
                  <Input placeholder="Иван Иванов" className="border-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Email</label>
                  <Input type="email" placeholder="example@mail.ru" className="border-2" />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">Сообщение</label>
                  <Textarea placeholder="Опишите ваш вопрос..." className="border-2 min-h-32" />
                </div>
                <Button className="w-full bg-gradient-to-r from-primary via-secondary to-accent text-lg py-6">
                  <Icon name="Send" className="mr-2" size={20} />
                  Отправить сообщение
                </Button>
              </form>

              <div className="mt-8 pt-8 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
                      <Icon name="Mail" className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-semibold">support@bushka.ru</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary to-accent rounded-xl flex items-center justify-center">
                      <Icon name="Phone" className="text-white" size={20} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Телефон</p>
                      <p className="font-semibold">+7 (800) 555-35-35</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="container mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="text-4xl">🛍️</div>
              <span className="text-2xl font-bold">БУшка</span>
            </div>
            <div className="flex gap-6">
              <Button variant="ghost" className="text-white hover:text-primary">
                <Icon name="Instagram" size={24} />
              </Button>
              <Button variant="ghost" className="text-white hover:text-primary">
                <Icon name="Facebook" size={24} />
              </Button>
              <Button variant="ghost" className="text-white hover:text-primary">
                <Icon name="Twitter" size={24} />
              </Button>
            </div>
          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-700">
            <p className="text-gray-400">© 2024 БУшка. Безопасная покупка и продажа б/у товаров</p>
          </div>
        </div>
      </footer>

      <Dialog open={isCreateAdOpen} onOpenChange={setIsCreateAdOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Разместить объявление
            </DialogTitle>
            <DialogDescription>
              Заполните форму, чтобы опубликовать ваше объявление
            </DialogDescription>
          </DialogHeader>

          <form className="space-y-6 mt-6" onSubmit={(e) => {
            e.preventDefault();
            setIsCreateAdOpen(false);
            setNewAd({ title: '', category: 'Электроника', price: '', location: '', description: '' });
          }}>
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
                onClick={() => setIsCreateAdOpen(false)}
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
    </div>
  );
};

export default Index;