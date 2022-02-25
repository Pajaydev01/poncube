import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'product',
    loadChildren: () => import('./modals/product/product.module').then( m => m.ProductPageModule)
  },
  {
    path: 'categories',
    loadChildren: () => import('./categories/categories.module').then( m => m.CategoriesPageModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./modals/register/register.module').then( m => m.RegisterPageModule)
  },
  {
    path: 'check-out',
    loadChildren: () => import('./modals/check-out/check-out.module').then( m => m.CheckOutPageModule)
  },
  {
    path: 'seller-items',
    loadChildren: () => import('./modals/seller-items/seller-items.module').then( m => m.SellerItemsPageModule)
  },
  {
    path: 'add-money',
    loadChildren: () => import('./modals/add-money/add-money.module').then( m => m.AddMoneyPageModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./modals/orders/orders.module').then( m => m.OrdersPageModule)
  },
  {
    path: 'subcategory',
    loadChildren: () => import('./popover/subcategory/subcategory.module').then( m => m.SubcategoryPageModule)
  },
  {
    path: 'sub-sub-category',
    loadChildren: () => import('./popover/sub-sub-category/sub-sub-category.module').then( m => m.SubSubCategoryPageModule)
  },
  {
    path: 'footers',
    loadChildren: () => import('./popover/footers/footers.module').then( m => m.FootersPageModule)
  },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.module').then( m => m.ShopPageModule)
  },
  {
    path: 'footpage',
    loadChildren: () => import('./footpage/footpage.module').then( m => m.FootpagePageModule)
  },
  {
    path: 'about',
    loadChildren: () => import('./about/about.module').then( m => m.AboutPageModule)
  },
  {
    path: 'delivery',
    loadChildren: () => import('./delivery/delivery.module').then( m => m.DeliveryPageModule)
  },
  {
    path: 'privacy',
    loadChildren: () => import('./privacy/privacy.module').then( m => m.PrivacyPageModule)
  },
  {
    path: 'terms',
    loadChildren: () => import('./terms/terms.module').then( m => m.TermsPageModule)
  },
  {
    path: 'faq',
    loadChildren: () => import('./faq/faq.module').then( m => m.FaqPageModule)
  },
  {
    path: 'transactions',
    loadChildren: () => import('./modals/transactions/transactions.module').then( m => m.TransactionsPageModule)
  },
  {
    path: 'edit',
    loadChildren: () => import('./modals/edit/edit.module').then( m => m.EditPageModule)
  },
  {
    path: 'rating',
    loadChildren: () => import('./popover/rating/rating.module').then( m => m.RatingPageModule)
  },
  {
    path: 'image-view',
    loadChildren: () => import('./modals/image-view/image-view.module').then( m => m.ImageViewPageModule)
  },
  {
    path: 'welcome',
    loadChildren: () => import('./guides/sellers/welcome/welcome.module').then( m => m.WelcomePageModule)
  },
  {
    path: 'guides',
    loadChildren: () => import('./popover/guides/guides.module').then( m => m.GuidesPageModule)
  },
  {
    path: 'seller-view',
    loadChildren: () => import('./popover/seller-view/seller-view.module').then( m => m.SellerViewPageModule)
  },
  {
    path: 'product-view',
    loadChildren: () => import('./product-view/product-view.module').then( m => m.ProductViewPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
