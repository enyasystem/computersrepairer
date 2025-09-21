-- WARNING: This will remove product and blog entries that are not part of the approved Nigeria seed set.
-- It deletes by excluding SKUs and slugs listed in the seed. Review before running.

BEGIN;

-- Delete products not in the approved Nigerian SKUs
DELETE FROM products
WHERE sku NOT IN (
  'RAM-CORSAIR-16GB','SSD-SAMSUNG-1TB','GPU-RTX3060','HDD-SEAGATE-2TB','PSU-CORSAIR-650W',
  'MB-ASUS-B450','SSD-KINGSTON-500GB','PERI-LOGITECH-MK270','MON-DEL-24','EXT-WD-1TB',
  'ROUTER-TPAX10','SD-SANDISK-128GB','CASE-CM-H500','COOL-NOCTUA-U12S','ACC-SURFACE-CHG'
);

-- Delete blog posts not in the approved Nigerian slugs
DELETE FROM blog_posts
WHERE slug NOT IN (
  '5-signs-computer-needs-repair','extend-laptop-battery-life','regular-computer-maintenance',
  'secure-wifi-lagos','ssd-for-nigerian-startups','backup-strategies-nigeria','pc-builds-students-abuja',
  'speed-up-older-laptops','localize-software-nigeria','network-troubleshooting-home',
  'antivirus-small-business','data-recovery-nigeria','optimize-office-networks-lagos',
  'buy-refurbished-laptops-nigeria','future-proof-home-office'
);

COMMIT;
