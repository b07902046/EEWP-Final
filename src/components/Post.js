import React from 'react'
import { Card, CardHeader, CardFooter, CardBody } from 'reactstrap'

const Post = ({
  data: {
    name,
    body
  },
  host: host
}) => (
  <Card style={{ margin: '30px auto', width: '300px', backgroundColor: 'yellow', 
  borderRadius: '5px', padding: '3px', textAlign: host == "1"? 'right' : 'left'}}>
    <CardBody>
      {name}: {body || <p style={{ opacity: 0.5 }}>No body for this post...</p>}
    </CardBody>
  </Card>
)

export default Post
