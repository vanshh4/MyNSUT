import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const classId = '00000000-0000-0000-0000-000000000000';
  const query = Prisma.sql`
      WITH feed AS (
        SELECT 
          id, 
          'OFFICIAL' as "type",
          title, 
          '' as excerpt,
          published_at as "publishedAt",
          source_authority as "sourceName",
          id as "metaId"
        FROM notices
        WHERE status = 'ACTIVE'
        
        UNION ALL
        
        SELECT 
          sa.id, 
          'SOCIETY' as "type",
          sa.title, 
          SUBSTRING(sa.content, 1, 150) as excerpt,
          sa.created_at as "publishedAt",
          s.name as "sourceName",
          sa.society_id as "metaId"
        FROM society_announcements sa
        JOIN societies s ON sa.society_id = s.id
        WHERE sa.is_public = true
        
        UNION ALL
        
        SELECT 
          ca.id,
          'CLASS' as "type",
          ca.title,
          SUBSTRING(ca.content, 1, 150) as excerpt,
          ca.created_at as "publishedAt",
          ac.name as "sourceName",
          ca.class_id as "metaId"
        FROM class_announcements ca
        JOIN academic_classes ac ON ca.class_id = ac.id
        WHERE ca.class_id = ${classId}::uuid
        
        UNION ALL
        
        SELECT 
          e.id,
          'EVENT' as "type",
          e.title,
          SUBSTRING(COALESCE(e.description, ''), 1, 150) as excerpt,
          e.created_at as "publishedAt",
          s.name as "sourceName",
          e.society_id as "metaId"
        FROM events e
        JOIN societies s ON e.society_id = s.id
        WHERE e.status = 'PUBLISHED'
      )
      SELECT * FROM feed
      WHERE 1=1
      ORDER BY "publishedAt" DESC, id DESC
      LIMIT 5;
  `;
  try {
    const res = await prisma.$queryRaw(query);
    console.log(res);
  } catch (err) {
    console.error(err);
  }
}
main();
