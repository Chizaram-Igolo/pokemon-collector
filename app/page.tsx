"use client";

import Head from "next/head";
import PokemonFlow from "@/components/PokemonFlow";

export default function Home() {
    return (
        <div>
            <Head>
                <title>Pokémon Collection Flow</title>
                <meta
                    name="description"
                    content="Pokémon Collection Flow Visualizer"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex justify-center items-center h-screen bg-gray-100">
                <PokemonFlow />
            </main>
        </div>
    );
}
