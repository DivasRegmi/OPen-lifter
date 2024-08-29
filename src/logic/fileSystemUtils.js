import { openDB } from "idb";

// Initialize IndexedDB with an object store for images
async function initDB() {
  return openDB("imageStoreDB", 1, {
    upgrade(db) {
      db.createObjectStore("images", { keyPath: "id" });
    },
  });
}

// Function to save an image to IndexedDB with a given ID
export async function saveImageToDB(imageData, id) {
  if (id == null) {
    console.warn("No ID provided. Skipping save operation.");
    return;
  }
  try {
    const db = await initDB();
    await db.put("images", { id, image: imageData });
    console.log(`Image saved to DB with ID: ${id}`);
  } catch (error) {
    console.error("Failed to save image to DB:", error);
  }
}

// Function to retrieve an image from IndexedDB using a given ID
export async function getImageFromDB(id) {
  if (id == null) {
    console.warn("No ID provided. Skipping retrieval operation.");
    return null;
  }
  try {
    const db = await initDB();
    const result = await db.get("images", id);

    if (result) {
      console.log(`Image retrieved from DB with ID: ${id}`);
      return result.image; // Return the Base64 image string
    } else {
      console.error(`No image found with ID: ${id}`);
      return null;
    }
  } catch (error) {
    console.error("Failed to retrieve image from DB:", error);
    return null;
  }
}

// Function to delete an image from IndexedDB by ID
export async function deleteImageFromDB(id) {
  if (id == null) {
    console.warn("No ID provided. Skipping delete operation.");
    return;
  }
  try {
    const db = await initDB();
    await db.delete("images", id);
    console.log(`Image deleted from DB with ID: ${id}`);
  } catch (error) {
    console.error("Failed to delete image from DB:", error);
  }
}

// Function to delete all images from IndexedDB
export async function deleteAllImagesFromDB() {
  try {
    const db = await initDB();
    const tx = db.transaction("images", "readwrite");
    const store = tx.objectStore("images");

    await store.clear();
    console.log("All images deleted from DB");
  } catch (error) {
    console.error("Failed to delete all images from DB:", error);
  }
}
