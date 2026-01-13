import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface Category {
  name: string;
  icon: string;
  count: number;
}

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  verified: boolean;
  seller: string;
  rating: number;
}

interface CatalogSectionProps {
  loading: boolean;
  filteredProducts: Product[];
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  priceRange: { min: string; max: string };
  setPriceRange: (range: { min: string; max: string }) => void;
  onlyVerified: boolean;
  setOnlyVerified: (verified: boolean) => void;
  categories: Category[];
  handleProductClick: (product: Product) => void;
}

const CatalogSection = ({
  loading,
  filteredProducts,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  priceRange,
  setPriceRange,
  onlyVerified,
  setOnlyVerified,
  categories,
  handleProductClick
}: CatalogSectionProps) => {
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('Все');
    setPriceRange({ min: '', max: '' });
    setOnlyVerified(false);
  };

  const hasActiveFilters = searchQuery || selectedCategory !== 'Все' || priceRange.min || priceRange.max || onlyVerified;

  return (
    <section id="catalog" className="py-20 px-6 bg-white/50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Актуальные объявления
          </h2>
          <p className="text-gray-600 text-lg">Свежие предложения от проверенных продавцов</p>
        </div>

        <Card className="mb-8 border-2">
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Icon name="Search" className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input 
                      placeholder="Поиск по названию или описанию..."
                      className="pl-10 border-2"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                </div>
                <div className="w-full md:w-48">
                  <select 
                    className="w-full h-10 px-3 rounded-md border-2 border-input bg-background"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="Все">Все категории</option>
                    {categories.map(cat => (
                      <option key={cat.name} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
                <div className="flex gap-2 items-center flex-1">
                  <Icon name="DollarSign" size={20} className="text-gray-600" />
                  <Input 
                    type="number"
                    placeholder="Цена от"
                    className="border-2 w-32"
                    value={priceRange.min}
                    onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                  />
                  <span className="text-gray-500">—</span>
                  <Input 
                    type="number"
                    placeholder="до"
                    className="border-2 w-32"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                  />
                </div>
                
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={onlyVerified}
                    onChange={(e) => setOnlyVerified(e.target.checked)}
                    className="w-4 h-4 text-primary border-2 rounded focus:ring-2 focus:ring-primary"
                  />
                  <Icon name="BadgeCheck" size={18} className="text-green-600" />
                  <span className="text-sm font-medium">Только проверенные</span>
                </label>

                {hasActiveFilters && (
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={resetFilters}
                    className="text-primary hover:text-primary/80"
                  >
                    <Icon name="X" size={16} className="mr-1" />
                    Сбросить
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-xl text-gray-600">Загрузка товаров...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold mb-2 text-gray-700">Ничего не найдено</h3>
            <p className="text-gray-600 mb-6">Попробуйте изменить параметры поиска</p>
            <Button 
              variant="outline"
              onClick={resetFilters}
              className="border-2 border-primary"
            >
              Сбросить фильтры
            </Button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-center">
              <Badge variant="secondary" className="text-sm">
                Найдено товаров: {filteredProducts.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
                <Card 
                  key={product.id} 
                  className="overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-2 hover:border-primary animate-scale-in group cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => handleProductClick(product)}
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
          </>
        )}

        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-2 border-primary hover:bg-primary/10">
            Показать все объявления
            <Icon name="ArrowRight" className="ml-2" size={20} />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CatalogSection;
