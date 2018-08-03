import Head from '../components/head'
import Header from '../components/header'
import Links from '../components/links'
import Footer from '../components/footer'

const Layout = ({children, goBack}) => (
  <div className='container'>
    <Head />
    <Header goBack={goBack} />
    {children}
    <Links />
    <Footer />
    <style jsx>{`
              .container {
                height: 100vh;
                flex-wrap: wrap;
                align-items: space-between;
                justify-content: center;
                display:flex;
              }
            `}</style>
  </div>
)

export default Layout
