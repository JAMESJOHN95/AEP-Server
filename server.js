const express = require('express');
const cors = require('cors');
const { getToken } = require('./Index'); // Ensure the correct path
const fetch = require('node-fetch')


const app = express();
const port = 3000;


app.use(express.static('public')); // Serve static files from the 'public' directory
app.use(cors());

// Endpoint to generate token

app.post('/generate-token', async (req, res) => {
  try {
    const token = await getToken();
    res.json({ token });
  } catch (error) {
    console.error('Error in token generation endpoint:', error);
    res.status(500).json({ error: 'Failed to generate token' });
  }
});

// Endpoint to fetch Profile Intergrity from Adobe API

app.get('/Profile-integrity', async (req, res) => {
  const accessToken = req.headers['authorization'];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not provided' });
  }
try {
  const URL = 'https://platform.adobe.io/data/core/ups/previewsamplestatus';
  const response = await fetch(URL, {
    headers: {
      'Accept': 'application/json',
      'Authorization': accessToken,
      'x-api-key': '2383827e418049e3ad41507d03374c2f',
      'x-gw-ims-org-id': '3C4727E253DB241C0A490D4E@AdobeOrg',
      'x-sandbox-name': 'uatmmh'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(response.status).json({ error: errorText });
  }

  const data = await response.json();
  res.json({data});
} catch (error) {
  console.error('Error fetching PROFILE DATA:', error);
  res.status(500).json({ error: 'Failed to fetch PROFILE DATA' });
}
});

// =================================== FETCH ENTITIES ===========================================//

app.get('/fetch-entities', async (req, res) => {
  const accessToken = req.headers['authorization'];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not provided' });
  }

  // Extract parameters from query string
const {
  schemaName = '_xdm.context.profile',  // Provide default values if needed
  relatedSchemaName = '',
  entityId = '',
  entityIdNS = 'CLPProfileD',
  relatedEntityId = '',
  relatedEntityIdNS = '',
  fields = 'person.name,_questrade',
  mergePolicyId = '',
  startTime = '',
  endTime = '',
  limit = '',
  orderby = '',
  property = '',
  withCA = ''
} = req.query;

  // Construct the URL with actual values =====================================================================
  const URL = `https://platform.adobe.io/data/core/ups/access/entities?schema.name=${schemaName}&relatedSchema.name=${relatedSchemaName}&entityId=${entityId}&entityIdNS=${entityIdNS}&relatedEntityId=${relatedEntityId}&relatedEntityIdNS=${relatedEntityIdNS}&fields=${fields}&mergePolicyId=${mergePolicyId}&startTime=${startTime}&endTime=${endTime}&limit=${limit}&orderby=${orderby}&property=${property}&withCA=${withCA}`;

  try {
    const response = await fetch(URL, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer  ${accessToken}`,
        'x-api-key': '2383827e418049e3ad41507d03374c2f',
        'x-gw-ims-org-id': '3C4727E253DB241C0A490D4E@AdobeOrg',
        'x-sandbox-name': 'uatmmh'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (error) {
    console.error('Error fetching entities:', error);
    res.status(500).json({ error: 'Failed to fetch entities' });
  }
});

// View the dataset ingested by batch id ========================================================================== 

app.get('/fetch-dataset-ingested', async (req, res) => {
  const accessToken = req.headers['authorization'];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not provided' });
  }

  const batchId = "01J25R27Q6BF3QF00K73P179MP";
  const URL = `https://platform.adobe.io/data/foundation/export/batches/${batchId}/files?start=1&limit=10`;

  try {
    const response = await fetch(URL, {
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'x-api-key': '2383827e418049e3ad41507d03374c2f',
        'x-gw-ims-org-id': '3C4727E253DB241C0A490D4E@AdobeOrg',
        'x-sandbox-name': 'uatmmh'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: errorText });
    }

    const data = await response.json();
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error('Error fetching profile by namespace:', err);
    res.status(500).json({ error: 'Failed to fetch profile by namespace' });
  }
});

// Get audiance with audiance id =============================================================

app.get('/fetch-audiance',async (req,res)=>{
  const accessToken = req.headers['authorization'];
  if (!accessToken) {
    return res.status(401).json({ error: 'Access token not provided' });
  }
  // const { start, limit, page, sort } = req.query;
  const SEGMENT_ID = "9a301250-1a10-4194-b3a3-2781e87c8814"

const URL = `https://platform.adobe.io/data/core/ups/segment/definitions/${SEGMENT_ID}`

try{
  const response = await fetch(URL, {
    headers: {
      'Accept': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
      'x-api-key': '2383827e418049e3ad41507d03374c2f',
      'x-gw-ims-org-id': '3C4727E253DB241C0A490D4E@AdobeOrg',
      'x-sandbox-name': 'uatmmh'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    return res.status(response.status).json({ error: errorText });
  }

  const data = await response.json();
  console.log(data);
  res.json(data);


}catch(err){
  console.error("Error fetching audiance".err);
  res.status(500).json({error:"Failed to fetch Audience"})
}

})



app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});