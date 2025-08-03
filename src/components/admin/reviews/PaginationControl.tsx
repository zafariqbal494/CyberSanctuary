import { memo } from 'react';
import { 
  Pagination, PaginationContent, PaginationEllipsis, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from "@/components/ui/pagination";

interface PaginationControlProps {
  currentPage: number;
  lastPage: number;
  onPageChange: (page: number) => void;
}

export const PaginationControl = memo(({ 
  currentPage, 
  lastPage, 
  onPageChange 
}: PaginationControlProps) => {
  if (lastPage <= 1) return null;
  
  const renderItems = () => {
    const items = [];
    
    // Previous button
    items.push(
      <PaginationItem key="prev">
        <PaginationPrevious 
          onClick={() => currentPage > 1 && onPageChange(currentPage - 1)}
          className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );
    
    // First page
    items.push(
      <PaginationItem key={1}>
        <PaginationLink 
          isActive={currentPage === 1}
          onClick={() => onPageChange(1)}
        >
          1
        </PaginationLink>
      </PaginationItem>
    );
    
    // Ellipsis if needed
    if (currentPage > 3) {
      items.push(
        <PaginationItem key="ellipsis1">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Pages around current
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(lastPage - 1, currentPage + 1); i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            isActive={currentPage === i}
            onClick={() => onPageChange(i)}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Ellipsis if needed
    if (currentPage < lastPage - 2) {
      items.push(
        <PaginationItem key="ellipsis2">
          <PaginationEllipsis />
        </PaginationItem>
      );
    }
    
    // Last page if not first page
    if (lastPage > 1) {
      items.push(
        <PaginationItem key={lastPage}>
          <PaginationLink 
            isActive={currentPage === lastPage}
            onClick={() => onPageChange(lastPage)}
          >
            {lastPage}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    // Next button
    items.push(
      <PaginationItem key="next">
        <PaginationNext 
          onClick={() => currentPage < lastPage && onPageChange(currentPage + 1)}
          className={currentPage === lastPage ? 'pointer-events-none opacity-50' : ''}
        />
      </PaginationItem>
    );
    
    return items;
  };
  
  return (
    <Pagination>
      <PaginationContent>
        {renderItems()}
      </PaginationContent>
    </Pagination>
  );
});

PaginationControl.displayName = 'PaginationControl'; 