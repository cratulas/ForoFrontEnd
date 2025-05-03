import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const platformId = inject(PLATFORM_ID);
  const router = inject(Router);

  if (isPlatformBrowser(platformId)) {
    const usuario = localStorage.getItem('usuario');
    if (usuario) return true;
  }

  router.navigate(['/login']);
  return false;
};
