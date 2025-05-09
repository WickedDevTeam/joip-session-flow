
import React, { ReactNode } from 'react';

interface MasonryGridProps {
  children: ReactNode;
  columns?: number;
  gap?: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ 
  children,
  columns = 3,
  gap = 4
}) => {
  const childrenArray = React.Children.toArray(children);
  const columnContents: ReactNode[][] = Array.from({ length: columns }, () => []);
  
  childrenArray.forEach((child, index) => {
    const columnIndex = index % columns;
    columnContents[columnIndex].push(
      <div key={index} className={`mb-${gap}`}>
        {child}
      </div>
    );
  });

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-${gap} animate-fade-in`}>
      {columnContents.map((columnItems, columnIndex) => (
        <div key={`column-${columnIndex}`} className="flex flex-col">
          {columnItems}
        </div>
      ))}
    </div>
  );
};

export default MasonryGrid;
