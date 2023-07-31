const uuid = require('uuid')
const path = require('path')
const {Devise, DeviseInfo} = require('../models/models')
const ApiError = require('../error/ApiError')

class DeviseController {
  async create(req, res, next) {
    try{
      let {name, price, typeId, brandId, info} = req.body
      const {img} = req.files
      let fileName = uuid.v4()+".jpg"
      await img.mv(path.resolve(__dirname, "..", "static", fileName))

      const devise = await Devise.create({name, price, typeId, brandId, img: fileName})
      if (info) {
        info = JSON.parse(info)
        await info.forEach(i=>{
          DeviseInfo.create({
            title: i.title,
            description: i.description,
            deviseId: devise.id
          })
        })
      }

      return res.json(devise)
    } catch (e) {
      next(ApiError.badRequest(e.message))
    }
  }
  async getAll(req, res) {
    let {brandId, typeId, page, limit} = req.query
    page = page || 1
    limit = limit || 10
    let offset = page * limit - limit
    let devises
    if (!brandId && !typeId) {
      devises = await Devise.findAndCountAll({limit, offset})
    }
    if (brandId && !typeId) {
      devises = await Devise.findAndCountAll({where:{brandId}, limit, offset})
    }
    if (!brandId && typeId) {
      devises = await Devise.findAndCountAll({where:{typeId}, limit, offset})
    }
    if (brandId && typeId) {
      devises = await Devise.findAndCountAll({where:{brandId, typeId}, limit, offset})
    }
    return res.json(devises)
  }
  async getOnce(req, res) {
    const {id} = req.params
    const devise = await Devise.findOne(
      {
        where: {id},
        include: [{model: DeviseInfo, as: 'info'}]
      }
    )
    res.json(devise)
  }
}

module.exports = new DeviseController()