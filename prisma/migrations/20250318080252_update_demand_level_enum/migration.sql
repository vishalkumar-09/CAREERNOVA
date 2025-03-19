-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.

-- Step 1: Create a new enum with the correct values
CREATE TYPE "DemandLevel_new" AS ENUM ('High', 'Medium', 'Low');

-- Step 2: Convert existing data to the new enum safely
ALTER TABLE "IndustryInsight" ALTER COLUMN "demandLevel" TYPE TEXT;
UPDATE "IndustryInsight"
SET "demandLevel" =
  CASE 
    WHEN "demandLevel" = 'HIGH' THEN 'High'
    WHEN "demandLevel" = 'MEDIUM' THEN 'Medium'
    WHEN "demandLevel" = 'LOW' THEN 'Low'
    ELSE "demandLevel"
  END;

-- Step 3: Apply the new enum type
ALTER TABLE "IndustryInsight" ALTER COLUMN "demandLevel" TYPE "DemandLevel_new" USING ("demandLevel"::"DemandLevel_new");

-- Step 4: Remove the old enum and rename the new one
ALTER TYPE "DemandLevel" RENAME TO "DemandLevel_old";
ALTER TYPE "DemandLevel_new" RENAME TO "DemandLevel";
DROP TYPE "DemandLevel_old";

ALTER TYPE "DemandLevel" ADD VALUE 'High';
ALTER TYPE "DemandLevel" ADD VALUE 'Medium';
ALTER TYPE "DemandLevel" ADD VALUE 'Low';

