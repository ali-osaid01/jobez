'use client';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from '@/components/ui/pagination';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type PaginationControlsProps = {
  page: number;
  totalPages: number;
  totalItems: number;
  pageSize: number;
  itemLabel: string;
  isLoading?: boolean;
  className?: string;
  onPageChange: (page: number) => void;
};

function getPageItems(page: number, totalPages: number): Array<number | 'ellipsis'> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  const visiblePages = Array.from(pages)
    .filter((value) => value >= 1 && value <= totalPages)
    .sort((a, b) => a - b);

  const items: Array<number | 'ellipsis'> = [];
  visiblePages.forEach((visiblePage, index) => {
    const previousPage = visiblePages[index - 1];
    if (previousPage && visiblePage - previousPage > 1) {
      items.push('ellipsis');
    }
    items.push(visiblePage);
  });

  return items;
}

export function PaginationControls({
  page,
  totalPages,
  totalItems,
  pageSize,
  itemLabel,
  isLoading = false,
  className,
  onPageChange,
}: PaginationControlsProps) {
  if (totalPages <= 1 && totalItems <= pageSize) {
    return null;
  }

  const safeTotalPages = Math.max(totalPages, 1);
  const safePage = Math.min(Math.max(page, 1), safeTotalPages);
  const startItem = totalItems === 0 ? 0 : (safePage - 1) * pageSize + 1;
  const endItem = Math.min(safePage * pageSize, totalItems);
  const pageItems = getPageItems(safePage, safeTotalPages);

  const goToPage = (nextPage: number) => {
    const clampedPage = Math.min(Math.max(nextPage, 1), safeTotalPages);
    if (clampedPage !== safePage) {
      onPageChange(clampedPage);
    }
  };

  return (
    <div className={cn('flex flex-col items-center gap-3 sm:flex-row sm:justify-between', className)}>
      <p className="text-sm text-muted-foreground">
        Showing <span className="font-medium text-foreground">{startItem}-{endItem}</span> of{' '}
        <span className="font-medium text-foreground">{totalItems}</span> {itemLabel}
        {totalItems === 1 ? '' : 's'}
      </p>

      <Pagination className="mx-0 w-auto">
        <PaginationContent>
          <PaginationItem>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage <= 1 || isLoading}
              onClick={() => goToPage(safePage - 1)}
            >
              Previous
            </Button>
          </PaginationItem>

          {pageItems.map((item, index) => (
            <PaginationItem key={`${item}-${index}`}>
              {item === 'ellipsis' ? (
                <PaginationEllipsis />
              ) : (
                <Button
                  type="button"
                  variant={item === safePage ? 'outline' : 'ghost'}
                  size="icon"
                  aria-current={item === safePage ? 'page' : undefined}
                  disabled={isLoading}
                  onClick={() => goToPage(item)}
                >
                  {item}
                </Button>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={safePage >= safeTotalPages || isLoading}
              onClick={() => goToPage(safePage + 1)}
            >
              Next
            </Button>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
