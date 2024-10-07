import { Button } from "@material-tailwind/react";
 
export function SubmitButton({label, onClick}) {
  return (
    <div className="w-max items-end gap-4">
      <Button size="md" onClick={onClick}>{label}</Button>
    </div>
  );
}