import Image from "next/image";

export function LBMLogo({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Image 
        src="/images/lbm-logo.png" 
        alt="LBM Engenharia" 
        width={200} 
        height={100} 
        className="w-full h-auto" 
        priority
      />
    </div>
  );
}

