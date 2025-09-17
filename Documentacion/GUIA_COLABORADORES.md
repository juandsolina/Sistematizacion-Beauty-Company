# 📘 Guía para colaborar en Sistematización Beauty Company

## 1️⃣ Clonar el repositorio (solo la primera vez)
```bash
git clone https://github.com/juandsolina/Sistematizacion-Beauty-Company.git
cd Sistematizacion-Beauty-Company
```

---

## 2️⃣ Cambiar a la rama `dev`
Por defecto, después de clonar estarán en `main`. Cambiar a `dev`:
```bash
git checkout dev
```

Verificar la rama activa:
```bash
git branch
```
👉 Debe aparecer un `*` junto a `dev`.

---

## 3️⃣ Flujo de trabajo diario
Antes de empezar a trabajar, traer la última versión de `dev`:
```bash
git pull origin dev
```

Luego trabajar normalmente, y cuando terminen cambios:

1. **Verificar estado de archivos**
   ```bash
   git status
   ```

2. **Agregar cambios**
   ```bash
   git add .
   ```

3. **Crear commit con mensaje**
   ```bash
   git commit -m "Descripción de los cambios realizados"
   ```

4. **Subir cambios a GitHub**
   ```bash
   git push origin dev
   ```

---

## 4️⃣ Buenas prácticas
- Siempre hacer `git pull origin dev` antes de empezar a trabajar.  
- Usar mensajes de commit claros (ejemplo: `"Agregada validación en el login"`).  
- **No trabajar en `main`** directamente.  
- Si dos personas cambian el mismo archivo, puede haber conflictos → se resuelven antes de hacer el commit final.  

---

## 5️⃣ Integración con `main`
- Solo el administrador del repositorio hace merge de `dev` → `main`.  
- Cuando `dev` tenga cambios estables y probados, se abre un **Pull Request** en GitHub.  

---

✅ Con esto todos trabajarán de manera organizada, sin romper la rama principal.
