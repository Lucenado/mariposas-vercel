import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = () => (
  <ContentLoader 
    speed={2}
    width={600}
    height={400}
    viewBox="0 0 600 400"
    backgroundColor="#f3f3f3"
    foregroundColor="#e3e3e3"
  >
    <rect x="0" y="0" rx="15" ry="15" width="600" height="400" />
  </ContentLoader>
)

export default MyLoader

