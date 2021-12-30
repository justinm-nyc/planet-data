import React from "react";
import { Layout } from "antd";
import PlanetTable from "./components/PlanetTable";
import "./App.css";

const { Header, Footer, Content } = Layout;

const App = () => (
  <div className="App">
    <Layout>
      <Header>
        <h1> Planets </h1>
      </Header>
      <Content className="site-layout-content" >
        <PlanetTable className="table-content" />
      </Content>
      <Footer />
    </Layout>
  </div>
);

export default App;
