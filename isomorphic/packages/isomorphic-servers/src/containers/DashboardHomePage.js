import React, {memo, useState, useEffect} from "react";
import LayoutContentWrapper from "@iso/components/utility/layoutWrapper";
import LayoutContent from "@iso/components/utility/layoutContent";
import axios from "axios";
import jwtConfig from "@iso/config/jwt.config";
import axiosConfig from "../library/helpers/axios";
import {Spin} from "antd";
import {Row, Col} from "antd";
import basicStyle from "@iso/assets/styles/constants";
import IntlMessages from "@iso/components/utility/intlMessages";
import IsoWidgetsWrapper from "./Widgets/WidgetsWrapper";
import SaleWidget from "./Widgets/Sale/SaleWidget";
import Chart from "react-google-charts";
import {BarChart} from "@iso/containers/Charts/GoogleChart/config";

const SALE_WIDGET = [
  {
    label: "widget.salewidget1.label",
    price: "widget.salewidget1.price",
    details: "widget.salewidget1.details",
    fontColor: "#F75D81",
  },
  {
    label: "widget.salewidget2.label",
    price: "widget.salewidget2.price",
    details: "widget.salewidget2.details",
    fontColor: "#F75D81",
  },
  {
    label: "widget.salewidget3.label",
    price: "widget.salewidget3.price",
    details: "widget.salewidget3.details",
    fontColor: "#F75D81",
  },
  {
    label: "widget.salewidget4.label",
    price: "widget.salewidget4.price",
    details: "widget.salewidget4.details",
    fontColor: "#F75D81",
  },
];
const MyComponent = () => {
  const {rowStyle, colStyle} = basicStyle;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const total = (input) => {
    const exchangeRate = 89.5;
    const operations = [
      {value: input.incomeUSD, factor: 1},
      {value: input.expenseUSD, factor: -1},
      {value: input.incomeSom, factor: 1 / exchangeRate},
      {value: input.expenseSom, factor: -1 / exchangeRate},
    ];

    const total = operations
      .map((op) => parseFloat(op.value ?? 0) * op.factor)
      .reduce((sum, current) => sum + current, 0);
    return total;
  };
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${jwtConfig.fetchUrlSecret}dashboard`,
          axiosConfig
        ); // Replace with your actual API endpoint

        const sale = response.data.finances.find((i) => i.cat == "SALES")._sum;

        const receiptTotal = total(sale);
        const transfer = response.data.finances.find(
          (i) => i.cat == "TRANSFER"
        )._sum;
        const transferTotal = -total(transfer);

        // console.log("transferTotal", transferTotal);
        // console.log("receipt", receiptTotal);

        const invest = response.data.finances.find(
          (i) => i.cat == "INVESTMENT"
        )._sum;
        const investTotal = total(invest);

        const cargo = response.data.finances.find((i) => i.cat == "CARGO")._sum;
        const cargoTotal = total(cargo);

        const finances = response.data.finances; // Your original array

        const excludedCategories = [
          "CARGO",
          "SALES",
          "INVESTMENT",
          "TRANSFER",
          "INIT",
          "OTHER",
        ];

        const filteredFinances = finances.filter(
          (item) => !excludedCategories.includes(item.cat)
        );
        const shopCostDetails = filteredFinances.map((i) => ({
          cat: i.cat,
          sum: -total(i._sum),
        }));
        const totalShopCost = shopCostDetails.reduce(
          (acc, curr) => acc + parseFloat(curr.sum),
          0
        );
        const chartData = [["Category", "Sum"]].concat(
          shopCostDetails.map((item) => [item.cat, item.sum])
        );
        // console.log("cost pie CAHART", JSON.stringify(shopCostDetails));
        // console.log("investTotal", investTotal);
        // console.log("cargoTotal", cargoTotal);

        const totalSaleAccount = response.data.profits.reduce(
          (acc, curr) => acc + parseFloat(curr.saleAmount),
          0
        );
        const totalProfit = response.data.profits.reduce(
          (acc, curr) => acc + parseFloat(curr.profit),
          0
        );
        const totalCost = response.data.profits.reduce(
          (acc, curr) => acc + parseFloat(curr.totalCost),
          0
        );
        // console.log("totalSaleAccount", totalSaleAccount);
        // console.log("totalProfit", totalProfit);
        // console.log("totalCost", totalCost);
        // console.log('totalSaleAccountProcessing', response.data.profitProcessing)
        // const totalSaleAccountProcessing =
        //   response.data.profitProcessing.reduce(
        //     (acc, curr) => acc + parseFloat(curr.saleAmount),
        //     0
        //   );
        // const totalProfitProcessing = response.data.profitProcessing.reduce(
        //   (acc, curr) => acc + parseFloat(curr.profit),
        //   0
        // );
        // const totalCostProcessing = response.data.profitProcessing.reduce(
        //   (acc, curr) => acc + parseFloat(curr.totalCost),
        //   0
        // );
        // console.log("totalSaleAccountProcessing", totalSaleAccountProcessing);
        // console.log("totalProfitProcessing", totalProfitProcessing);
        // console.log("totalCostProcessing", totalCostProcessing);

        const namesAndCalculateSoldOutRatiosChartData = [
          ['Name', 'Total', 'Ratio'],
        ].concat(
          response.data.namesAndCalculateSoldOutRatios.map((item) => {
            const ratio = parseFloat(item.ratio.replace("%", "")); // Convert "ratio" to a number
            const label = `${item.Chinesename} (${
              item.codeChina ?? "No Code"
            })`; // Combine "Chinesename" and "codeChina"
            return [label, item.total, ratio];
          })
        );

        console.log(
          "nonsoldout",
          JSON.stringify(response.data.nonsoldout)
        );


        setData({
          totalSaleAccount: totalSaleAccount,
          totalCost: totalCost,
          totalProfit: totalProfit,
          transferTotal: transferTotal.toFixed(2),
          investTotal: investTotal.toFixed(2),
          cargoTotal: -cargoTotal.toFixed(2),
          chartData: chartData,
          totalShopCost: totalShopCost.toFixed(2),
          namesAndCalculateSoldOutRatiosChartData:
          namesAndCalculateSoldOutRatiosChartData,
          // totalSaleAccountProcessing: totalSaleAccountProcessing,
          // totalProfitProcessing: totalProfitProcessing,
          // totalCostProcessing: totalCostProcessing
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false); // Set loading to false after data is fetched (including error cases)
      }
    };

    fetchData();
  }, []);

  const SaleWidgets = React.memo(() => {
    return SALE_WIDGET.map((widget, index) => (
      <SaleWidget
        key={index}
        label={widget.label}
        price={widget.price}
        fontColor={widget.fontColor}
        details={widget.details}
      />
    ));
  });

  const PieChart = React.memo(() => (
    <Chart
      width={"500px"}
      height={"300px"}
      chartType="PieChart"
      loader={<div>Loading Chart</div>}
      data={data.chartData}
      options={{
        title: "My Pie Chart",
      }}
    />
  ));

  const BarChart = React.memo(() => (
    <Chart
      width={"100%"}
      height={"1800px"}
      chartType="BarChart"
      loader={<div>Loading Chart</div>}
      data={data.namesAndCalculateSoldOutRatiosChartData}
      options={{
        title: "Inventory Analysis",
        chartArea: {width: "100%"},
        hAxis: {
          title: "Values",
        },
        vAxis: {
          title: "Name and Code",
        },
        seriesType: "bars",
        series: {1: {type: "line"}}, // Display ratio as a line
      }}
    />
  ))

  return (
    <Spin spinning={loading}>
      <LayoutContentWrapper>
        <LayoutContent>
          <Row style={rowStyle} gutter={0} justify="start">
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={"Total Sale Account"}
                  price={data.totalSaleAccount}
                  fontColor={"#F75D81"}
                />
              </IsoWidgetsWrapper>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={"Total Cost"}
                  price={data.totalCost}
                  fontColor={"#F75D81"}
                />
              </IsoWidgetsWrapper>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={"Total Profit"}
                  price={data.totalProfit}
                  fontColor={"#F75D81"}
                />
              </IsoWidgetsWrapper>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={0} justify="start">
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={"Transfer to China"}
                  price={data.transferTotal}
                  fontColor={"#F75D81"}
                />
              </IsoWidgetsWrapper>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={"InvestTotal"}
                  price={data.investTotal}
                  fontColor={"#F75D81"}
                />
              </IsoWidgetsWrapper>
            </Col>
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
              <IsoWidgetsWrapper>
                {/* Sale Widget */}
                <SaleWidget
                  label={"Cargo Total"}
                  price={data.cargoTotal}
                  fontColor={"#F75D81"}
                />
              </IsoWidgetsWrapper>
            </Col>
          </Row>
          <Row style={rowStyle} gutter={0} justify="start">
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
              <SaleWidget
                label={"Total Shop Cost"}
                price={data.totalShopCost}
                fontColor={"#F75D81"}
              />
            </Col>
            <Col lg={6} md={12} sm={12} xs={24} style={colStyle}>
             <PieChart />
            </Col>
          </Row>
          <Row style={rowStyle} gutter={0} justify="start">
            <Col lg={24} md={24} sm={24} xs={24} style={colStyle}>
             <BarChart />
            </Col>
          </Row>
        </LayoutContent>
      </LayoutContentWrapper>
    </Spin>
  );
};
export default MyComponent;
