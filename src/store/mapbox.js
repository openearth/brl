import wps from '../lib/wps';
import layers from '../lib/mapbox/layers';
import { generateWmsLayer } from '../lib/project-layers';

const initialState = () => ({
  features: [],
  wmsLayers: [],
  loadingWmsLayers: false,
  activePopup: null
});

const features = {
  namespaced: true,
  state: initialState(),
  mutations: {
    addFeature(state, feature) {
      state.features.push(feature);
    },
    removeFeature(state, id) {
      state.features = state.features.filter(feature => feature.id !== id);
    },
    addWmsLayer(state, wmsLayer) {
      state.wmsLayers.push(wmsLayer);
    },
    resetWmsLayers(state) {
      state.wmsLayers = [];
    },
    setLoadingWmsLayers(state, value) {
      state.loadingWmsLayers = value;
    },
    setActivePopup(state, popup) {
      state.activePopup = popup;
    },
    set(state, data) {
      state = data;
    },
    reset(state) {
      Object.assign(state, initialState());
    },
  },
  actions: {
    getFeature({ commit }, feature) {
      commit('selections/setLoadingSelection', { id: feature.id, value: true }, { root: true });

      wps({
        "functionId": "brl_watercourses",
        "polygon": {
          "id": feature.id,
          "type": "Feature",
          "properties": {},
          "geometry": feature.geometry
        },
        "bufferDist": "100"
      })
      .then(({ watersCollection, watersIdentifier }) => {
        commit('addFeature', {
          ...layers.geojson.line({
            id: feature.id,
            data: watersCollection,
            paint: {
              'line-width': 5,
              'line-color': '#000',
              'line-opacity': 0.8
            }
          }),
          watersIdentifier
        });
        commit('selections/setLoadingSelection', { id: feature.id, value: false }, { root: true });
      })
      .catch(err => {
        // @TODO :: Have proper error handling here!
        console.log('Error getting wps: ', err);
      });
    },
    async calculateResult({ commit }, requestData) {
      commit("setLoadingWmsLayers", true);

      try {
        const data = {
          functionId: "brl_gwmodel",
          requestData: requestData
        };

        const layers = await wps(data);

        const wmsLayers = layers.map(({ url, layer, name }) => {
          return {
            ...generateWmsLayer({
              url,
              layer,
              id: layer,
            }),
            name: name,
            baseUrl: url,
          };
        });

        wmsLayers.forEach((wmsLayer) => commit("addWmsLayer", wmsLayer));
      } catch (err) {
        console.log(err);
        commit("setError", "Error fetching result", { root: true });
      }

      commit("setLoadingWmsLayers", false);
    }
  }
};

export default features;
