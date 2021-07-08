test_dataset <- read.csv('test_dataset.csv',header=TRUE, sep = ";")
str(test_dataset)
head(test_dataset)
names(test_dataset)

items_ids <- test_dataset$item_id
length(items_ids)

class(items_ids)

genero <- test_dataset$qual_e_seu_genero
class(genero)
levels(genero)


mean(test_dataset$escore_obtido)

p <- function(){
  
}
stats4::mle(p)