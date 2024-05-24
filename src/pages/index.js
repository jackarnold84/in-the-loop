import * as React from "react"
import Layout from "../components/Layout"
import Container from "../components/common/Container"

const IndexPage = () => {
  return (
    <Layout>
      <Container size={16} centered>
        <h2>Gatsby Template</h2>
        <p>Starter template for Gatsby projects with various reusable components</p>
      </Container>
    </Layout>
  )
}

export default IndexPage

export const Head = () => <title>Home Page</title>
