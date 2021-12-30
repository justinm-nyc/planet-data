import React, { useState, useEffect } from "react";
import { Table, Spin, message } from "antd";

export default function PlanetTable() {
  const [planetsData, setPlanetsData] = useState([]);
  const [isloading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadPlanets() {
      setIsLoading(true);

      const url = "https://swapi.dev/api/planets/";
      await fetch(url)
        .then((data) => {
          if (data.ok) {
            return data.json();
          }
          setIsLoading(false);
          throw new Error("Network error.");
        })
        .then((data) => {
          const formattedData = formatAndSortData(data);
          const planetTableData = formattedData.map((planet, idx) => {
            return {
              key: idx,
              name: { name: planet.name, url: planet.url },
              url: planet.url,
              climate: planet.climate,
              residents: planet.residents.length,
              terrain: planet.terrain,
              population: getPopulation(planet.population),
              surface_area_in_water: getSurfaceAreaInWater(
                planet.diameter,
                planet.surface_water
              ),
            };
          });
          setPlanetsData(planetTableData);
        })
        .catch((err) => message.error("Error: " + err));
      setIsLoading(false);
    }

    loadPlanets();
  }, []);

  function formatAndSortData(data) {
    // Set all unknown values to '?'
    data.results.forEach((planet) => {
      Object.keys(planet).forEach((key, index) => {
        if (planet[key] === "unknown") planet[key] = "?";
      });
    });

    // Sort the planets by alphabetical order
    return data.results.sort((a, b) => a.name.localeCompare(b.name));
  }

  function getPopulation(population) {
    return population === "?"
      ? population
      : Number(population).toLocaleString("ru-RU");
  }

  function getSurfaceAreaInWater(diameter, surface_water) {
    if (diameter === "?" || surface_water === "?") return "?";
    const r = diameter / 2;
    const surfaceAreaOfPlanet = 4 * Math.PI * Math.pow(r, 2);
    const surfaceAreaInWater = surfaceAreaOfPlanet * (surface_water / 100);
    return Math.round(surfaceAreaInWater).toLocaleString("ru-RU");
  }

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (obj) => <a href={obj.url}>{obj.name}</a>,
    },
    {
      title: "Climate",
      dataIndex: "climate",
      key: "climate",
    },
    {
      title: "Residents",
      dataIndex: "residents",
      key: "residents",
      sorter: (a, b) => a.residents - b.residents,
    },
    {
      title: "Terrain",
      dataIndex: "terrain",
      key: "terrain",
    },
    {
      title: "Population",
      dataIndex: "population",
      key: "population",
    },
    {
      title: (
        <p>
          Surface Area (in km<sup>2</sup>) Covered In Water
        </p>
      ),
      dataIndex: "surface_area_in_water",
      key: "surface_area_in_water",
    },
  ];

  return isloading ? (
    <div>
      <h2>LOADING DATA</h2>
      <Spin size="large" />
    </div>
  ) : (
    <div>
      <Table
        dataSource={planetsData}
        columns={columns}
        pagination={false}
        bordered
      />
    </div>
  );
}
