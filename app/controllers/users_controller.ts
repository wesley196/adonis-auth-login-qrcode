import { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import {deleteUser, editUser} from '#abilities/main'


export default class UsersController {

  // Fonction pour s'inscrire
  public async singIn({ request, response }: HttpContext) {
    // Récupérer les données de l'utilisateur depuis la requête
    const user = request.only(['email', 'password'])

    if (!user) {
        response.redirect('singIn')
    }

    try {
      // Création de l'utilisateur dans la base de données
      const addUser = await User.create({
        email: user.email,
        password: user.password, // Le hashage est géré dans le hook du modèle
      })

      // Si l'utilisateur est ajouté avec succès, rediriger vers le tableau de bord
      return response.redirect('pages/login')

    } catch (error) {
      // Log l'erreur dans la console pour comprendre ce qui se passe
      console.error('Erreur lors de la création de l\'utilisateur:', error)

      // En cas d'erreur, redirige vers la page de connexion
      return response.status(500).redirect('login')
    }
  }

  // Fonction ou methode pour loguer un utilisateur
  public async login({request, auth, response}: HttpContext) {
 
         const { email, password } = request.only(['email','password'])
 
          
 
         try {
          const user = await User.verifyCredentials(email, password) 
          await auth.use('web').login(user)
             response.redirect('pages/home')
 
         } catch (error) {
             console.error('Erreur lors de la création de l\'utilisateur:', error)
 
             // En cas d'erreur, redirige vers la page de connexion
             return response.status(500).redirect('singIn')
         }
     }
 
     // Methode pour supprimer un User
  public async deleteUser({response, params, bouncer}:HttpContext){

    const user =params.id

    try {
      const useData = await User.findByOrFail(user)

      if (!await bouncer.allows(deleteUser,useData)) {
        return response.forbidden('you cannot delete user')
      }
      await user.delete()
    } catch (error) {
      
    }

  }

  public async editUser({response,params,bouncer,request}:HttpContext){
    const userId = params.id
    const data = request.all()

    try {
      const userData = await User.findOrFail(userId)

      if (!await bouncer.allows(editUser,profil)) {
        return response.forbidden('you cannot update user')
      }
      await data.merge(userData)
      await userData.save()

    } catch (error) {
      
    }
  }

}
