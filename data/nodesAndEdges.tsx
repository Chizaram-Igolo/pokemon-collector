import { FlowViewEdge, FlowViewNode, Position } from "@ant-design/pro-flow";
import { Progress } from "antd";
import React from "react";
import Image from "next/image";
import StarRating from "@/components/StarRating";
import RangeLine from "@/components/RangeLine";
import { SelectType } from "@ant-design/pro-flow/es/FlowView/constants";

export const messages = {
    default: (
        <p>
            Click on a <em>Pokémon</em> / item <br />
            to collect it or a grunt to attack it
        </p>
    ),
    collectLastPokemon: <p>Collect the last Pokémon first</p>,
    acquireFishingRod: (
        <p>
            You need to acquire the <br />
            Fishing Rod (Old Rod) first
        </p>
    ),
    defeatGrunt: <p>You need to defeat the grunt first</p>,
    defeatedGrunt: (
        <p>
            Grunt defeated! Proceed to <br />
            the final challenge
        </p>
    ),
    lastPokemonCollected: <p>Last Pokémon collected!</p>,
    keepGoing: <p>You're doing great!</p>,
};

export const ApiScore: React.FC<{ score: number }> = ({ score }) => {
    const scorePercent = score * 20;

    return (
        <Progress
            style={{
                fontSize: "6px",
                textAlign: "center",
            }}
            type="circle"
            trailColor={"white"}
            percent={score === 0 ? 1 : scorePercent}
            strokeColor={
                scorePercent >= 80
                    ? "#30a46c"
                    : scorePercent >= 60
                    ? "orange"
                    : "#e5484d"
            }
            format={() => `${score}`}
            size={28}
        />
    );
};

const pokemons = [
    {
        label: "Forest Encounter",
        title: "Pikachu",
        logo: "/pikachu.png",
        timeOfDayImage: "/sun.gif",
        location: "Viridian Forest",
        specialMove: "Thunderbolt",
        specialMoveImage: "/lightning.png",
        catchRate: 3,
        levelRange: [10, 15],
        position: [400, -350],
    },
    {
        label: "Water's Edge",
        title: "Magikarp",
        logo: "/magikarp.png",
        location: "Route 6 Pond",
        specialMove: "Splash",
        specialMoveImage: "/splash.png",
        catchRate: 5,
        fishingRodRequired: "Old Rod",
        levelRange: [5, 10],
        position: [800, -300],
    },
    {
        label: "Cave Discovery",
        title: "Zubat",
        logo: "/zubat.png",
        timeOfDayImage: "/24-7.png",
        location: "Mt. Moon",
        specialMove: "Leech Life",
        specialMoveImage: "/leech.png",
        catchRate: 4,
        levelRange: [12, 16],
        position: [1200, -400],
    },
    {
        label: "Grassland Venture",
        title: "Oddish",
        logo: "/magikarp.png",
        timeOfDayImage: "/night.gif",
        location: "Route 5",
        specialMove: "Absorb",
        specialMoveImage: "/absorb.png",
        catchRate: 3,
        levelRange: [13, 18],
        position: [1600, -400],
    },
    {
        label: " Final Challenge",
        title: "Growlithe",
        logo: "/growlithe.png",
        location: "Pokémon Mansion",
        specialMove: "Ember",
        specialMoveImage: "/honey.png",
        catchRate: 2,
        levelRange: [20, 25],
        position: [1600, -140],
    },
];

const otherNodes: FlowViewNode[] = [
    {
        id: "item1",
        data: {
            title: "Poké Ball",
            logo: "/pokeball.png",
            description: "Your adventure awaits you",
            titleSlot: {
                type: "right",
                value: <ApiScore score={0} />,
            },
            isItem: true,
        },
        position: { x: 300, y: -500 },
        select: SelectType.SUB_SELECT,
    },
    {
        id: "item2",
        data: {
            title: "Old Rod",
            logo: "/fishing-rod.png",
            description: (
                <p>
                    Will be needing this for the next <br />
                    pokemon...
                </p>
            ),
            isItem: true,
        },
        position: { x: 800, y: -460 },
        select: SelectType.SUB_SELECT,
    },
    {
        id: "grunt1",
        data: {
            label: " Final Challenge",
            title: "Team Rocket Grunt",
            logo: "/grunt.png",
            description: "Prepare for trouble!",
        },
        position: { x: 1200, y: -60 },
        select: SelectType.SUB_SELECT,
    },
];

const feedbackNodes: FlowViewNode[] = [
    {
        id: "feedback1",
        data: {
            title: "Game Guide",
            logo: "/info.png",
            description: (
                <p>
                    Click on a <em>Pokemon</em> / item <br />
                    to collect it or a grunt to attack it
                </p>
            ),
            isItem: true,
        },
        position: { x: 900, y: -600 },
        select: SelectType.SUB_SELECT,
    },
];

const pokemonNodes: FlowViewNode[] = pokemons.map((pokemon, index) => ({
    id: `pokemon${index + 1}`,
    label: pokemon.label,
    position: { x: pokemon.position[0], y: pokemon.position[1] },
    data: {
        title: pokemon.title,
        titleSlot: pokemon.timeOfDayImage && {
            type: "right",
            value: (
                <Image
                    src={pokemon.timeOfDayImage}
                    alt="daytime"
                    width={24}
                    height={24}
                />
            ),
        },
        logo: pokemon.logo,
        description: (
            <ul className="mt-8">
                <li className="flex flex-row mb-2">
                    <div>
                        <Image
                            src="/location.png"
                            alt="location"
                            width={18}
                            height={18}
                        />
                    </div>
                    &nbsp;
                    <div>
                        <span className="text-md">{pokemon.location}</span>
                    </div>
                </li>
                <br />
                <li className="flex flex-row mb-2">
                    • &nbsp;&nbsp;<div>Special Move:</div>
                    &nbsp;
                    <div>
                        <Image
                            src={pokemon.specialMoveImage}
                            alt={pokemon.specialMove}
                            width={18}
                            height={18}
                        />
                    </div>
                    &nbsp;
                    <div>
                        <span className="text-md">{pokemon.specialMove}</span>
                    </div>
                </li>
                <li className="flex flex-row mb-2">
                    • &nbsp;&nbsp;
                    <div>
                        <span>Catch Rate:</span>
                    </div>
                    &nbsp;
                    <div>
                        <StarRating rating={pokemon.catchRate} />
                    </div>
                </li>
                <li
                    className={`flex flex-row ${
                        pokemon.fishingRodRequired ? "mb-2" : ""
                    }`}
                >
                    • &nbsp;&nbsp;
                    <div>
                        <span>Level Range:</span>
                    </div>
                    &nbsp;&nbsp;
                    <div>
                        <RangeLine
                            startLevel={pokemon.levelRange[0]}
                            endLevel={pokemon.levelRange[1]}
                        />
                    </div>
                </li>
                {pokemon.fishingRodRequired && (
                    <li className="flex flex-row">
                        • &nbsp;&nbsp;
                        <div>
                            <span>Fishing Rod Required:</span>
                        </div>
                        &nbsp;&nbsp;&nbsp;
                        <div>
                            <span>Old Rod</span>
                        </div>
                    </li>
                )}
            </ul>
        ),
        isCharacter: true,
    },
    select: SelectType.SUB_SELECT,
}));

export const nodes: FlowViewNode[] = [
    ...pokemonNodes,
    ...otherNodes,
    ...feedbackNodes,
];

export const edges: FlowViewEdge[] = [
    {
        id: "item1-pokemon1",
        source: "item1",
        target: "pokemon1",
        animated: true,
    },
    {
        id: "pokemon1-item2",
        source: "pokemon1",
        target: "item2",
        animated: true,
    },
    {
        id: "item2-pokemon2",
        source: "item2",
        target: "pokemon2",
        animated: true,
    },
    {
        id: "pokemon2-pokemon3",
        source: "pokemon2",
        target: "pokemon3",
        animated: true,
    },
    {
        id: "pokemon3-pokemon4",
        source: "pokemon3",
        target: "pokemon4",
        animated: true,
    },
    {
        id: "pokemon4-grunt1",
        source: "pokemon4",
        target: "grunt1",
        type: "radius",
        animated: true,
    },
    {
        id: "grunt1-pokemon5",
        source: "grunt1",
        target: "pokemon5",
        animated: true,
    },
];
