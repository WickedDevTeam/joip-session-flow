
import React, { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
  columns?: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ 
  children,
  columns = 3
}) => {
  const childrenArray = React.Children.toArray(children);
  const columnContents: ReactNode[][] = Array.from({ length: columns }, () => []);
  
  childrenArray.forEach((child, index) => {
    const columnIndex = index % columns;
    columnContents[columnIndex].push(
      <div key={index} className="mb-4">
        {child}
      </div>
    );
  });

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${Math.min(columns, 3)} lg:grid-cols-${columns} gap-4`}>
      {columnContents.map((columnItems, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex flex-col">
          {columnItems}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
