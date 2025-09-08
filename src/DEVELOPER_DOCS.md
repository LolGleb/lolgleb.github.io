# Ticket to Socks — Документация для разработчиков

## Обзор проекта

**Ticket to Socks** — независимое медиа-издание о носках с минималистичной, смелой, фото-ориентированной эстетикой, вдохновленной Hypebeast, Huckmag и Office magazine.

### Ключевые особенности:
- 🧦 Специализированный контент о культуре носков
- 📱 Адаптивный дизайн для всех устройств  
- 🎨 Современная типографическая система
- 🔍 Продвинутая система фильтрации брендов
- 👤 Система профилей и избранного
- ⭐ Интерактивная система оценок
- 📝 Подача контента и брендов

## Технический стек

- **Frontend Framework**: React 18 + TypeScript
- **Роутинг**: React Router v6
- **Стилизация**: Tailwind CSS v4.0
- **UI Components**: shadcn/ui
- **Иконки**: Lucide React
- **Шрифты**: Space Grotesk (заголовки), Satoshi (текст)
- **State Management**: React Context API
- **Build Tool**: Vite

## Архитектура проекта

### Структура файлов

```
├── App.tsx                 # Главный компонент приложения
├── components/             # Переиспользуемые компоненты
│   ├── ui/                # shadcn/ui компоненты
│   └── figma/             # Специальные компоненты
├── contexts/              # React Context провайдеры
├── pages/                 # Компоненты страниц
├── data/                  # Моковые данные и утилиты
├── types/                 # TypeScript определения
├── styles/                # Глобальные стили
├── utils/                 # Утилиты
└── guidelines/            # Руководства по дизайну
```

### Контексты (Contexts)

#### 1. AuthContext
Управление аутентификацией пользователей
```typescript
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
```

#### 2. FavoritesContext  
Система избранных материалов
```typescript
interface FavoritesContextType {
  favorites: string[];
  addToFavorites: (articleId: string) => void;
  removeFromFavorites: (articleId: string) => void;
  isFavorite: (articleId: string) => boolean;
}
```

#### 3. ThemeContext
Переключение светлой/темной темы
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

#### 4. NewsletterContext
Управление подпиской на рассылку
```typescript
interface NewsletterContextType {
  isSubscribed: boolean;
  subscribe: (email: string) => Promise<void>;
  unsubscribe: () => void;
}
```

#### 5. EngagementContext
Отслеживание взаимодействий (лайки, просмотры)
```typescript
interface EngagementContextType {
  engagements: Record<string, Engagement>;
  recordView: (articleId: string) => void;
  recordLike: (articleId: string) => void;
  recordShare: (articleId: string) => void;
}
```

## Дизайн-система

### Типографика

**Шрифты:**
- `Space Grotesk` — заголовки, логотип, навигация
- `Satoshi` — основной текст, даты, категории

**CSS переменные:**
```css
--font-headlines: 'Space Grotesk', sans-serif;
--font-body: 'Satoshi', sans-serif;
```

### Брендинг

**Ключевая особенность:** Обязательная приставка "to" к названиям рубрик:
- Строчными буквами
- Курсивом  
- Цвет фуксия (#FF00A8)

**Примеры:**
- "SOCK BRANDS *to*"
- "News *to* read"
- "Stories *to* discover"

### Цветовая палитра

**Основные цвета:**
- `#FF00A8` — акцентный цвет (фуксия)
- `#ffffff` — фон (светлая тема)
- `oklch(0.145 0 0)` — текст (светлая тема)

**CSS переменные доступны в Tailwind:**
```css
bg-[#FF00A8]      /* Акцентный фон */
text-[#FF00A8]    /* Акцентный текст */
bg-background     /* Фон темы */
text-foreground   /* Текст темы */
```

## Основные компоненты

### Навигационные компоненты

#### Header.tsx
Основная навигация с адаптивным меню
- Логотип с фирменной стилизацией
- Навигационное меню рубрик
- Поиск и переключатель темы
- Мобильное меню

#### Footer.tsx  
Футер с дополнительными ссылками
- Подписка на рассылку
- Социальные сети
- Правовая информация

### Контентные компоненты

#### ArticleGrid.tsx
Универсальная сетка статей с настраиваемыми параметрами:
```typescript
interface ArticleGridProps {
  articles: Article[];
  showCategory?: boolean;
  gridCols?: string;
  showAuthor?: boolean;
}
```

#### BrandsSection.tsx
Универсальная секция брендов с фильтрацией:
```typescript
interface BrandsSectionProps {
  defaultFilter?: 'madeIn' | 'price' | 'categories' | 'all';
  defaultSelection?: string;
  maxBrands?: number;
  showAllFilters?: boolean;
  title?: string;
  className?: string;
}
```

#### Hero.tsx
Главный блок на homepage с адаптивным дизайном

#### EditorsPick.tsx
Секция избранных материалов редакции

### UI компоненты (shadcn/ui)

Все компоненты находятся в `/components/ui/` и настроены под дизайн-систему проекта:

- `Button` — кнопки с фирменными цветами
- `Badge` — теги и категории
- `Input` — поля ввода
- `Tabs` — табы для навигации
- `Dialog` — модальные окна
- И другие...

## Страницы (Pages)

### Главные страницы

#### HomePage.tsx
Структура блоков: EditorsPick → Hero → SubmitSection → BrandsSection

#### BrandsPage.tsx  
Полная система фильтрации брендов:
- Фильтры: Made in, Price, Categories, ALL
- Система поиска
- Алфавитная навигация
- Submit Brand секция

#### BrandPage.tsx
Детальная страница бренда:
- Hero секция с рейтингом
- Описание и информация
- Контакты и где купить
- Связанные статьи

### Контентные страницы

#### NewsPage.tsx, DropsPage.tsx, StoriesPage.tsx
Категориальные страницы со структурой:
- Основная статья (featured)
- Секция Latest & Popular
- Сетка статей категории

#### ArticlePage.tsx
Детальная страница статьи:
- Контент статьи
- Информация об авторе
- Блок взаимодействий (лайки, шеринг)
- Связанные статьи
- Комментарии

### Пользовательские страницы

#### AuthPage.tsx
Объединенная страница входа/регистрации

#### ProfilePage.tsx  
Страница профиля пользователя с настройками

#### BookmarksPage.tsx
Избранные материалы пользователя

## Система данных

### Основные типы

```typescript
interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  category: 'News' | 'Drops' | 'Stories';
  subtype?: string;
  author: Author;
  publishedAt: string;
  tags: string[];
  readingTime: number;
  slug: string;
}

interface Brand {
  id: string;
  name: string;
  description: string;
  logo: string;
  image: string;
  heroImage: string;
  website: string;
  founded: number;
  headquarters: string;
  madeIn: string[];
  priceRange: string[];
  categories: string[];
  rating?: BrandRating;
  contacts?: ContactInfo;
  whereToBuy?: WhereToBuyInfo;
}

interface Author {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  social: SocialLinks;
}
```

### Моковые данные

Файл `/data/mockData.ts` содержит:
- 20+ брендов с полной информацией
- 30+ статей по всем рубрикам  
- Категории брендов
- Функции для фильтрации и поиска

## Маршрутизация

```typescript
// Основные страницы
/ → HomePage
/news → NewsPage  
/drops → DropsPage
/stories → StoriesPage
/brands → BrandsPage
/about → AboutPage

// Детальные страницы
/article/:id → ArticlePage
/brand/:id → BrandPage
/author/:id → AuthorPage
/brands/:slug → BrandCategoryPage

// Пользовательские страницы
/auth → AuthPage (/login, /register)
/profile → ProfileRedirect → ProfilePage
/bookmarks → BookmarksPage

// Служебные страницы
/search → SearchPage
/submit → SubmitPage
/brand/submit → BrandSubmitPage
/tags → TagsPage
/tag/:slug → TagPage
/privacy → PrivacyPage
/terms → TermsPage
```

## Руководство по разработке

### Стилизация

**Важно:** Не используйте Tailwind классы для типографики (text-*, font-*, leading-*), если это не требуется специально. Базовая типографика настроена через CSS.

```css
/* ✅ Правильно */
<h1>Заголовок</h1>

/* ❌ Неправильно */  
<h1 className="text-2xl font-bold">Заголовок</h1>
```

### Компоненты

**Соглашения:**
- Используйте существующие UI компоненты из `/components/ui/`
- Создавайте переиспользуемые компоненты в `/components/`
- Следуйте структуре props с TypeScript интерфейсами

### Изображения

- Используйте `ImageWithFallback` вместо `<img>`
- Для новых изображений используйте Unsplash API
- Поддерживайте фолбеки для всех изображений

### Состояние

- Используйте контексты для глобального состояния
- Локальное состояние — `useState`
- Побочные эффекты — `useEffect`

## API и интеграции

### Unsplash API
Для получения изображений используется Unsplash API через `unsplash_tool`.

### Потенциальные интеграции
- Supabase — для бэкенда и аутентификации
- Newsletter API — для подписок
- Analytics — для отслеживания

## Производительность

### Оптимизации
- Lazy loading для изображений  
- React.lazy для страниц
- Мемоизация дорогих вычислений
- Оптимизация bundle размера

### Мониторинг
- Core Web Vitals
- Время загрузки страниц
- Производительность на мобильных устройствах

## Развертывание

### Build
```bash
npm run build
```

### Preview
```bash
npm run preview  
```

### Environment Variables
Настройте переменные окружения для:
- API ключи
- URL бэкенда
- Analytics ID

## Тестирование

### Рекомендуемый стек
- Jest — юнит тесты
- React Testing Library — тестирование компонентов
- Cypress — E2E тестирование

### Приоритеты тестирования
1. Критические пользовательские пути
2. Формы и взаимодействия
3. Фильтрация и поиск
4. Адаптивный дизайн

## Доступность (A11y)

### Требования
- Семантическая разметка HTML
- ARIA атрибуты где необходимо
- Клавиатурная навигация
- Контрастность цветов
- Альтернативный текст для изображений

### Инструменты
- axe-core для автоматического тестирования
- Lighthouse аудиты
- Screen reader тестирование

## Безопасность

### Клиентская безопасность
- XSS защита через правильную обработку пользовательского ввода
- CSP заголовки
- HTTPS принудительно

### Данные пользователей
- Минимизация сбора данных
- Соблюдение GDPR
- Безопасное хранение токенов

## Мониторинг и аналитика

### Метрики
- Пользовательские сессии
- Популярные страницы
- Конверсии подписок
- Производительность

### Инструменты
- Google Analytics 4
- Ошибки — Sentry
- Производительность — Web Vitals

---

*Документация обновлена: December 2024*
*Версия проекта: 1.0.0*