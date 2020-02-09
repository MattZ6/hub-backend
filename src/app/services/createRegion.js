import { where, fn, col } from 'sequelize';

import Region from '../models/Region';

export default async function(location) {
  const regionName = location.trim();

  const region = await Region.findOne({
    where: where(fn('LOWER', col('name')), fn('LOWER', regionName)),
    attributes: ['id', 'name'],
  });

  if (region) {
    return region;
  }

  const { id, name } = await Region.create({ name: regionName });

  return { id, name };
}
