import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getLocalImagePaths } from '@/lib/download-images'
import { SheetType, type Blog } from '@caoji/shared'
import { format } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'

export function BlogCard({ id, title, content, datetime, images }: Blog) {
  const [thumbnail] = getLocalImagePaths(SheetType.Blogs, id, images)

  return (
    <Link href={`/blogs/${id}`} className="group block">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-lg pt-0">
        {thumbnail && (
          <div className="relative w-full overflow-hidden aspect-video">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle className="transition-colors group-hover:text-primary">{title}</CardTitle>
          <CardDescription>{format(datetime, 'yyyy-MM-dd')}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">{content}</p>
        </CardContent>
      </Card>
    </Link>
  )
}
