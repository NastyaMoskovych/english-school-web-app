import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { ActivatedRoute, RouterLinkWithHref } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

interface Breadcrumb {
  labelKey: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLinkWithHref, TranslateModule],
  templateUrl: './breadcrumb.component.html',
  styleUrl: './breadcrumb.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BreadcrumbComponent implements OnInit {
  private activatedRoute = inject(ActivatedRoute);

  breadcrumbs: Breadcrumb[] = [
    {
      labelKey: 'general.breadcrumbs.home',
      url: '/',
    },
  ];

  ngOnInit() {
    this.breadcrumbs = [
      ...this.breadcrumbs,
      ...this.createBreadcrumbs(this.activatedRoute.root),
    ];
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = [],
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;

        breadcrumbs.push({
          labelKey: `general.breadcrumbs.${routeURL}`,
          url,
        });
      }

      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
