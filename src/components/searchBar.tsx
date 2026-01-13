"use client"

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Search } from 'lucide-react'

export default function SearchBar({ className }: { className?: string }) {
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`)
    }
  }

  return (
    <form onSubmit={handleSearch} className={cn("relative w-full", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground text-blue-200" />
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder={'Search anime...'}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-10 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          "bg-blue-700/80 border-blue-500/50 text-white placeholder:text-blue-200 focus-visible:ring-blue-300"
        )}
      />
      <Button
        type="submit"
        variant="ghost"
        size="sm"
        className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0 hover:bg-blue-600/50"
      >
        <Search className="h-4 w-4 text-blue-200" />
        <span className="sr-only">Search</span>
      </Button>
    </form>
  )
}