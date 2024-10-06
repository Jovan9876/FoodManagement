import { Textarea } from "@material-tailwind/react";
 
export function TextareaSizes({label, value, onChange}) {
  return (
    <div className="w-auto gap-6">
      {/* <Textarea size="md" label="Textarea Medium" /> */}
      <Textarea size="lg" label={label} value={value} onChange={onChange}/>
    </div>
  );
}