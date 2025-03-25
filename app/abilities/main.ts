/*
|--------------------------------------------------------------------------
| Bouncer abilities
|--------------------------------------------------------------------------
|
| You may export multiple abilities from this file and pre-register them
| when creating the Bouncer instance.
|
| Pre-registered policies and abilities can be referenced as a string by their
| name. Also they are must if want to perform authorization inside Edge
| templates.
|
*/

import { Bouncer } from '@adonisjs/bouncer'
import { rolesValues } from '../enumes/RolesEnumes.js'
import User from '#models/user'
import Url from '#models/url'

/**
 * Delete the following ability to start from
 * scratch
 */
// export const editUser = Bouncer.ability(() => {
//   return true
// })

export const deleteUrl = Bouncer.ability((user:User)=>{
  return user.role === rolesValues.ADMIN
})

export const editUrl = Bouncer.ability((user:User, url:Url)=>{
  return user.role === rolesValues.ADMIN && user.id === url.user_id 
  // si le user a le role admin et que l'id de user est l'id du créateur de l'url, donc il peut modifier
}) 

export const deleteUser = Bouncer.ability((user:User, profil:Profil)=>{
  return user.role === rolesValues.ADMIN || user.id === profil.user_id
})

export const editUser = Bouncer.ability((user:User, profil:Profil)=>{
  return  user.id === profil.user_id || user.role === rolesValues.ADMIN
})