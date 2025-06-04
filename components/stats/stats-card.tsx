import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"

interface StatsCardItem {
  label: string
  value: string
  subValue?: string
}

interface StatsCardProps {
  title: string
  icon: LucideIcon
  items: StatsCardItem[]
}

export function StatsCard({ title, icon: Icon, items }: StatsCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2 mb-4">
        <Icon className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-sm">{title}</h3>
      </div>

      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index}>
            {index === 0 && (
              <div className="text-lg font-medium">{item.value}</div>
            )}
            {index === 0 && !items[0].label.includes("Total") && (
              <div className="text-sm text-muted-foreground">{item.label}</div>
            )}
            
            {index > 0 && (
              <>
                <div className="flex items-center justify-between mt-3">
                  <div className="text-sm text-muted-foreground">{item.label}</div>
                  <div className="text-sm font-medium">{item.value}</div>
                </div>
                {item.subValue && (
                  <div className="text-xs text-muted-foreground text-right">{item.subValue}</div>
                )}
              </>
            )}
          </div>
        ))}
      </div>
    </Card>
  )
} 