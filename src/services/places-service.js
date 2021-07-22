import { PlaceModel } from "../models/place";
import { CustomError } from "../utils/custom-error";

export const PlaceService = {
  async createPlace(plateIncoming) {
    try {
      let place = new PlaceModel(plateIncoming);
      place = await place.save();
      return place;
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(400, "Name is already in use");
      }else{
          throw new CustomError(500, JSON.stringify(error))
      }
    }
  },
  async getPlants (requestedPage){
      try {
          const page = await PlaceModel.paginate({},{page:requestedPage})
          return page;
      } catch (error) {
          throw new CustomError(500, 'Internal Server Error')
      }
  },
  async getAllPlaces(){
    try {
      const places = await PlaceModel.find().select('name _id')
      return places
    } catch (error) {
      throw new CustomError(500, 'Internal Server Error')
    }
  }
};
