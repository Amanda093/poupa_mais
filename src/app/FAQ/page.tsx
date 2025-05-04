import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Title,
} from "@/components";

const FAQPage = () => {
  return (
    <div className="pb-[5em]">
      <div className="container mx-auto py-[60px] xl:!max-w-[1270px]">
        <div className="max-lg:text-center">
          <Title mainTitle="Dúvidas" subTitle="Frequentes" />
        </div>

        <Accordion
          type="multiple"
          className="form-shadow text-body flex w-full flex-col gap-[35px] rounded-[1em] !px-[1.2em] py-[1.5em] transition-[height]"
        >
          {/* pergunta 01 */}
          <AccordionItem value="item-1">
            <AccordionTrigger>O que é o Poupa+?</AccordionTrigger>
            <AccordionContent>
              O Poupa+ é um sistema web de auxílio financeiro que ajuda você a
              entender melhor seus gastos mensais e a planejar suas finanças com
              base em sugestões geradas por inteligência artificial.
            </AccordionContent>
          </AccordionItem>

          {/* pergunta 02 */}
          <AccordionItem value="item-2">
            <AccordionTrigger>
              Como o sistema sabe o que sugerir?
            </AccordionTrigger>
            <AccordionContent>
              As sugestões são geradas pela IA Llama, que analisa as despesas
              que você informou e oferece dicas personalizadas para economizar
              ou reorganizar seu orçamento.
            </AccordionContent>
          </AccordionItem>

          {/* pergunta 03 */}
          <AccordionItem value="item-3">
            <AccordionTrigger>O Poupa+ funciona em celular?</AccordionTrigger>
            <AccordionContent>
              Sim! O sistema foi desenvolvido com design responsivo, ou seja,
              funciona tanto em computadores quanto em dispositivos móveis.
            </AccordionContent>
          </AccordionItem>

          {/* pergunta 04 */}
          <AccordionItem value="item-4">
            <AccordionTrigger>
              Posso sugerir melhorias ou relatar bugs?
            </AccordionTrigger>
            <AccordionContent>
              Com certeza! Você pode abrir uma <i>issue</i> no repositório do
              <a href="https://github.com/Amanda093/poupa_mais"> GitHub</a> ou
              entrar em contato com um dos contribuidores listados no final da
              página.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
export default FAQPage;
