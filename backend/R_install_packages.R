
# Install dependencies. Used in Dockerfile
f = read.csv('R_packages_dependencies.csv', header=FALSE, stringsAsFactors = FALSE)
z = install.packages(f[,1], repos='https://cran.rstudio.com')  