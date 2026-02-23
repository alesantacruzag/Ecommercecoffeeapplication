import { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { Label } from '../components/ui/label';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '../components/ui/sheet';
import { ProductCard } from '../components/ProductCard';
import { MOCK_PRODUCTS } from '../utils/mockData';
import { motion } from 'motion/react';
import type { RoastLevel } from '../types';

export default function Catalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrigin, setSelectedOrigin] = useState<string>('all');
  const [selectedRoast, setSelectedRoast] = useState<string>('all');
  const [priceRange, setPriceRange] = useState<number[]>([0, 30]);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('name');

  // Get unique origins
  const origins = useMemo(() => {
    const uniqueOrigins = [...new Set(MOCK_PRODUCTS.map(p => p.origin))];
    return uniqueOrigins;
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS];

    // Search filter
    if (searchQuery) {
      products = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.origin.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Origin filter
    if (selectedOrigin !== 'all') {
      products = products.filter(p => p.origin === selectedOrigin);
    }

    // Roast filter
    if (selectedRoast !== 'all') {
      products = products.filter(p => p.roast === selectedRoast);
    }

    // Price filter
    products = products.filter(p => {
      const price = p.discount ? p.price * (1 - p.discount / 100) : p.price;
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Rating filter
    products = products.filter(p => p.rating >= minRating);

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        products.sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        products.sort((a, b) => b.rating - a.rating);
        break;
      case 'name':
      default:
        products.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return products;
  }, [searchQuery, selectedOrigin, selectedRoast, priceRange, minRating, sortBy]);

  const FilterContent = () => (
    <div className="space-y-6">
      <div>
        <Label className="mb-2 block">Origen</Label>
        <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los orígenes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los orígenes</SelectItem>
            {origins.map(origin => (
              <SelectItem key={origin} value={origin}>{origin}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">Nivel de tueste</Label>
        <Select value={selectedRoast} onValueChange={setSelectedRoast}>
          <SelectTrigger>
            <SelectValue placeholder="Todos los niveles" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los niveles</SelectItem>
            <SelectItem value="Claro">Claro</SelectItem>
            <SelectItem value="Medio">Medio</SelectItem>
            <SelectItem value="Oscuro">Oscuro</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="mb-2 block">
          Rango de precio: ${priceRange[0]} - ${priceRange[1]}
        </Label>
        <Slider
          min={0}
          max={30}
          step={1}
          value={priceRange}
          onValueChange={setPriceRange}
          className="mt-2"
        />
      </div>

      <div>
        <Label className="mb-2 block">
          Calificación mínima: {minRating} ⭐
        </Label>
        <Slider
          min={0}
          max={5}
          step={0.5}
          value={[minRating]}
          onValueChange={(value) => setMinRating(value[0])}
          className="mt-2"
        />
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => {
          setSelectedOrigin('all');
          setSelectedRoast('all');
          setPriceRange([0, 30]);
          setMinRating(0);
        }}
      >
        Limpiar filtros
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-[24px] mx-[0px] mt-[0px] mb-[-2px]"><span className="font-bold">Catálogo de Cafés</span></h1>
          <p className="text-gray-600 text-[14px]">
            Descubre nuestra selección de {MOCK_PRODUCTS.length} cafés especiales de Colombia
          </p>
        </motion.div>

        {/* Search and Sort Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, descripción u origen..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre (A-Z)</SelectItem>
                <SelectItem value="price-asc">Precio (menor a mayor)</SelectItem>
                <SelectItem value="price-desc">Precio (mayor a menor)</SelectItem>
                <SelectItem value="rating">Calificación</SelectItem>
              </SelectContent>
            </Select>

            {/* Mobile Filters */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" className="md:hidden">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filtros
                </Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Filtros</SheetTitle>
                </SheetHeader>
                <div className="mt-6">
                  <FilterContent />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Desktop Filters Sidebar */}
          <aside className="hidden md:block">
            <div className="bg-white p-6 rounded-lg shadow-sm sticky top-20">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="h-5 w-5" />
                <h2 className="font-semibold text-lg">Filtros</h2>
              </div>
              <FilterContent />
            </div>
          </aside>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            <div className="mb-4 text-sm text-gray-600">
              {filteredProducts.length} producto{filteredProducts.length !== 1 ? 's' : ''} encontrado{filteredProducts.length !== 1 ? 's' : ''}
            </div>

            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="bg-white p-12 rounded-lg shadow-sm text-center">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos con los filtros seleccionados.
                </p>
                <Button 
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedOrigin('all');
                    setSelectedRoast('all');
                    setPriceRange([0, 30]);
                    setMinRating(0);
                  }}
                  className="mt-4 bg-[#F72585] hover:bg-[#F72585]/90"
                >
                  Limpiar todos los filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
