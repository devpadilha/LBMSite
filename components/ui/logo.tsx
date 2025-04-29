import Image from 'next/image'
import React from 'react'

interface LogoProps {
  size?: 'sm' | 'md' | 'lg'
  withText?: boolean
}

export function Logo({ size = 'md', withText = true }: LogoProps) {
  const sizeMap = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  }

  return (
    <div className="flex items-center gap-2">
      <div className={`${sizeMap[size]} bg-[#EC610D] rounded-md flex items-center justify-center`}>
        <Image
          src="/logo-lbm.png"
          alt="LBM Logo"
          width={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
          height={size === 'sm' ? 24 : size === 'md' ? 32 : 40}
          priority
        />
      </div>
      {withText && <span className="font-bold text-xl">LBM Engenharia</span>}
    </div>
  )
}