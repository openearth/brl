export const xmlRequestTemplate = ({ functionId, requestData, polygon, roadsIdentifier, filterData, cswUrls, bufferDist, segmentLength}) => {
  // filter out all the empty lines created by the ternary statements fo inputs
  return removeEmptyLines(
`<wps:Execute xmlns:wps="http://www.opengis.net/wps/1.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" version="1.0.0" service="WPS" xsi:schemaLocation="http://www.opengis.net/wps/1.0.0 http://schemas.opengis.net/wps/1.0.0/wpsAll.xsd">
    <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${functionId}</ows:Identifier>
    <wps:DataInputs>
      ${ wpsInput('roads_identifier', roadsIdentifier) }
      ${ requestData ? wpsInput('layers_setup', JSON.stringify(requestData)) : '' }
      ${ polygon ? wpsInput('geojson_area', JSON.stringify(polygon)) : '' }
      ${ filterData ? wpsInput('keywords', JSON.stringify(filterData)): ''}
      ${ cswUrls ? wpsInput('csw_url', JSON.stringify(cswUrls)): ''}
      ${ bufferDist ? wpsInput('buffer_dist', bufferDist): ''}
      ${ segmentLength ? wpsInput('segment_length', segmentLength): ''}
    </wps:DataInputs>
    <wps:ResponseForm>
      <wps:RawDataOutput mimeType="application/json">
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">output_json</ows:Identifier>
      </wps:RawDataOutput>
    </wps:ResponseForm>
  </wps:Execute>`);
};

function wpsInput(identifier, data) {
  return `
      <wps:Input>
        <ows:Identifier xmlns:ows="http://www.opengis.net/ows/1.1">${identifier}</ows:Identifier>
        <ows:Title xmlns:ows="http://www.opengis.net/ows/1.1">${identifier}</ows:Title>
        <wps:Data>
          <wps:LiteralData>${ data }</wps:LiteralData>
        </wps:Data>
      </wps:Input>
  `;
}

function removeEmptyLines(template) {
  return template.replace(/^\s*\n/gm, '');
}
