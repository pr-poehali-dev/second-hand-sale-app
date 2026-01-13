import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import Icon from '@/components/ui/icon';

interface HeaderProps {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  scrollToSection: (section: string) => void;
  onCreateAdClick: () => void;
}

const Header = ({ isMobileMenuOpen, setIsMobileMenuOpen, scrollToSection, onCreateAdClick }: HeaderProps) => {
  return (
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
              onClick={onCreateAdClick}
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
                      onCreateAdClick();
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
  );
};

export default Header;
