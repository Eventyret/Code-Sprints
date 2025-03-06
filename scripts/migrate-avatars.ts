import { ConvexClient } from "convex/browser";
import { api } from "../convex/_generated/api";

async function migrateAvatars() {
  const client = new ConvexClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  
  try {
    console.log("Starting avatar migration...");
    const result = await client.mutation(api.users.migrateUserAvatars, {});
    console.log(`Migration completed successfully. Updated ${result.usersUpdated} users.`);
  } catch (error) {
    console.error("Error during migration:", error);
  } finally {
    await client.close();
  }
}

migrateAvatars().catch(console.error); 