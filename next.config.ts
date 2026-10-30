import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

const nextConfig: NextConfig = {
  images: {
    // Photos produits hébergées dans le compartiment public Supabase Storage.
    remotePatterns: supabaseUrl ? [new URL(`${supabaseUrl.replace(/\/+$/, "")}/storage/v1/object/public/**`)] : [],
  },
};

export default nextConfig;
