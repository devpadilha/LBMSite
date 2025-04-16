import { PlusCircle, Search, Eye, Filter } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Watermark } from "@/components/watermark"

type DataTableProps = {
  title: string;
  description: string;
  searchPlaceholder: string;
  newItemText: string;
  newItemPath: string;
  columns: { key: string; label: string; className?: string }[];
  data: any[];
  renderCell: (_item: any, _column: string) => React.ReactNode;
  detailsPath: (_id: string) => string;
}

export function DataTable({
  title,
  description,
  searchPlaceholder,
  newItemText,
  newItemPath,
  columns,
  data,
  renderCell,
  detailsPath
}: DataTableProps) {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-1">{description}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 mt-4 md:mt-0 w-full md:w-auto">
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder={searchPlaceholder} className="pl-8 w-full sm:w-[200px] md:w-[300px]" />
          </div>
          <Button variant="outline" size="icon" className="hidden sm:flex">
            <Filter className="h-4 w-4" />
          </Button>
          <Link href={newItemPath}>
            <Button className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600">
              <PlusCircle className="mr-2 h-4 w-4" />
              {newItemText}
            </Button>
          </Link>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden relative">
        <Watermark />
        
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key} className={column.className}>
                  {column.label}
                </TableHead>
              ))}
              <TableHead className="text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                {columns.map((column) => (
                  <TableCell key={`${item.id}-${column.key}`} className={column.className}>
                    {renderCell(item, column.key)}
                  </TableCell>
                ))}
                <TableCell className="text-right">
                  <Link href={detailsPath(item.id)}>
                    <Button variant="ghost" size="sm" className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      Detalhes
                    </Button>
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}