import { Injectable } from '@nestjs/common';
import { prisma } from '@byob/db';

function distanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1*Math.PI/180) * Math.cos(lat2*Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

@Injectable()
export class WarehouseService {
  list() { return prisma.warehouse.findMany({ include: { inventory: true } }); }

  async nearest(lat: number, lon: number) {
    const warehouses = await prisma.warehouse.findMany();
    let best = warehouses[0];
    let bestDist = Number.POSITIVE_INFINITY;
    for (const w of warehouses) {
      const d = distanceKm(lat, lon, w.latitude, w.longitude);
      if (d < bestDist) { bestDist = d; best = w; }
    }
    return { warehouse: best, distanceKm: bestDist };
  }
}
