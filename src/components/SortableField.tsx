
import { ReactNode } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, IconButton } from "@mui/material";
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import { FieldConfigType } from "../types/form";

type SortableFieldsProps = {
  items: FieldConfigType[]; 
  onDragEnd: (items: FieldConfigType[]) => void;
  renderItem: (item: FieldConfigType) => ReactNode;
  disableEdit?: boolean;
}

const SortableFields=({ items, onDragEnd, renderItem }: SortableFieldsProps) =>{
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over &&active.id !== over?.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onDragEnd(newItems);
    }
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((item) => item.id)} strategy={verticalListSortingStrategy}>
        <Box sx={{ border: '1px solid #ddd', borderRadius: 2, p: 2 }}>
          {items.map((item) => (
            <SortableItem key={item.id} id={item.id}>
              {renderItem(item)}
            </SortableItem>
          ))}
        </Box>
      </SortableContext>
    </DndContext>
  );
}

function SortableItem({ id, children }: { id: string; children: ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: "12px 16px",
    borderRadius: "4px",
    border: "1px solid #ccc",
    marginBottom: "8px",
    cursor: "move",
    boxShadow: transform ? "0 4px 12px rgba(0,0,0,0.1)" : "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <IconButton sx={{ mr: 2 }} {...listeners} {...attributes}>
        <DragIndicatorIcon />
      </IconButton>
      {children}
    </div>
  );
};

export default SortableFields;
