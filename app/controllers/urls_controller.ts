import { editUrl } from '#abilities/main'
import Url from '#models/url'
import { Bouncer } from '@adonisjs/bouncer'
import type { HttpContext } from '@adonisjs/core/http'
import QRCode from 'qrcode'

export default class UrlsController {
  public async generate({request,response}:HttpContext){

const {url,shortUrl} = request.all()


   try {

    const qrCode = await QRCode.toDataURL(url)
    const addUrlData = await Url.create({fullUrl:url.url,shortUrl,qrCode})
    if (!addUrlData) {
      return response.status(401).send({messages:"Données éronées"})
    }

    return response.redirect('pages/goToUrl')
   } catch (error) {
    return response.status(400).send({messages:error})

   }
  }

  public async showUrls({response,view}:HttpContext){
    try {
      const getUrlsData = await Url.all()
      if (!getUrlsData) {
        return response.status(400).send({messages:"non trouvé"})
      }
      const parseUrlsToJSON = getUrlsData.map((url)=>url.toJSON())

      return view.render('pages/goToUrl',{parseUrlsToJSON})
    } catch (error) {

    }
  }

  public async deleteUser({ params }:HttpContext){

    const getUrl = params.urlId // on recupere l'id du client dans l'object params
    

    try {
      const deleteUrl = await Url.findOrFail(getUrl)
      await deleteUrl.delete()
    } catch (error) {
      
    }
    
  }


  public async editUrl({params,request,bouncer,response}:HttpContext){
    const getUrl = params.urlId
    const getNewUrl = request.all()


    try {
      const url = await Url.findByOrFail(getUrl)
       if (!await bouncer.allows(editUrl, url)){
        return response.forbidden('you cannot edit URL')
      }
      
      await getNewUrl.save()
    } catch (error) {
      
    }
  }

}
